var fs        = require('fs');
var exec      = require('child_process').exec;
var rmdir     = require('rimraf');

var sspawn    = require('@mh-cbon/c-yasudo');
var spawn     = require('child_process').spawn;
var pkg       = require('../package.json');
var debug     = require('debug')(pkg.name);
var dStream   = require('debug-stream')(debug);

var codes = {
  '1':  "Can't update password file. Are you root?",
  '2':  "Invalid command syntax",
  '3':  "Invalid argument to option",
  '4':  "UID already in use (and no -o)",
  '6':  "Specified group doesn't exist",
  '9':  "Username already in use",
  '10': "Can't update group file",
  '12': "Can't create home directory",
  '13': "Can't create mail spool",
  '14': "Can't update SELinux user mapping"
}

function determine_error (err) {
  if (err.code && codes[err.code.toString()])
    return new Error(codes[err.code.toString()]);
  else
    return new Error(err.message || 'Failed');
}

function exists (user, then) {
  var child = spawn('id', [user], {stdio: 'pipe'})
  var e;
  child.on('error', function (err) {
    e = err;
  })
  var stderr = '';
  child.stderr.on('data', function (d) {
    stderr += d.toString();
  })
  child.stdout.pipe(dStream('stdout %s'))
  child.stderr.pipe(dStream('stderr %s'))
  child.on('close', function (code) {
    if(code!==0) return then(e || new Error(stderr.replace(/\s+$/, '')), false)
    return then(null, true)
  })
}

function create (opts, then) {

  var user      = opts.user,
      home      = opts.h || opts.home,
      home_dir  = opts.d || opts.home_dir,
      full_name = opts.f || opts.full_name,
      user_id   = opts.i || opts.user_id,
      group_id  = opts.g || opts.group_id,
      shell     = opts.s || opts.shell || '/bin/bash';

  var groups = opts.groups && opts.groups.split(',')
  home_dir = home_dir || '/home/' + user;

  var args = [];

  if (full_name) args = args.concat(['-c', full_name]); // comment field, but used as user's full name

  if (shell) args = args.concat(['-s', shell]);

  if (user_id) {
    args = args.concat(['-uid', user_id]);
  }

  if (group_id) {
    args = args.concat('-gid', group_id);
  } else {
    args.push('-U'); // create a group called as the user, and add him to it.
  }

  if (groups) {
    args.push('-G');
    args = args.concat(groups.split(','))
  }

  if (opts.system) {
    args.push('-r'); // system account
  }

  if (home) {
    args = args.concat(['-d', home_dir]);
    if (!fs.existsSync(home_dir)) args.push('-m'); // also create it, if missing
  } else {
    args.push('-M'); // do not create home. there is none!
  }

  args.push(user);

  debug('useradd %s', args.join(' '));
  var child = sspawn('useradd', args, {stdio: 'pipe'});
  var stdout = '';
  child.stdout.on('data', function (d) {
    stdout += d.toString();
  })
  child.stdout.pipe(dStream('stdout %s'))
  child.stderr.pipe(dStream('stderr %s'))
  child.on('close', function (code) {
    if (code!==0) return then(determine_error(code));
    then(null, stdout);
  })
}

function remove (user, opts, then) {

  if (typeof opts == 'function') {
    then = opts;
    opts = {};
  }

  var args = [];
  if (opts.remove || opts.r) args.push('--remove')
  args.push(user)
  debug('userdel %s', args.join(' '));
  var child = sspawn('userdel', args);
  var stdout = '';
  child.stdout.on('data', function (d) {
    stdout += d.toString();
  })
  child.stdout.pipe(dStream('stdout %s'))
  child.stderr.pipe(dStream('stderr %s'))
  child.on('close', function (code) {
    if (code!==0) return then(new Error('Could not delete user'));
    then(null, stdout);
  })

}

function get_groups (username, then) {
  var child = spawn('id', ['-Gn', username], {stdio: 'pipe'})
  var stdout = '';
  child.stdout.on('data', function (d) {
    stdout += d.toString();
  })
  var stderr = '';
  child.stderr.on('data', function (d) {
    stderr += d.toString();
  })
  var e;
  child.on('error', function (err) {
    e = err;
  })
  child.stdout.pipe(dStream('stdout %s'))
  child.stderr.pipe(dStream('stderr %s'))
  child.on('close', function (code) {
    if(code!==0) return then(e || new Error(stderr.replace(/\s+$/, '')), [])
    return then(null, stdout.split(/\s+/).slice(0, -1))
  })
}

module.exports = {
  delete:     remove,
  create:     create,
  exists:     exists,
  get_groups: get_groups,
}

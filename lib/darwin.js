var rimraf = require('rimraf');
var exec   = require('child_process').exec;
var async  = require('async');

var fs          = require('fs');
var dscl        = '/usr/bin/dscl';
var edit_group  = '/usr/sbin/dseditgroup';
var pkg         = require('../package.json');
var debug       = require('debug')(pkg.name);
var dStream     = require('debug-stream')(debug);
var sspawn      = require('@mh-cbon/c-yasudo');
var spawn       = require('child_process').spawn;
var dscacheutil = require('@mh-cbon/dscacheutil')


var sexec = function (bin, args, then) {
  debug('%s %s', bin, args.join(' '))
  var child = sspawn(bin, args, {stdio: 'pipe'})
  child.stdout.pipe(dStream('stdout %s'));
  child.stderr.pipe(dStream('stderr %s'));
  var stderr = '';
  child.stderr.on('data', function (d) {
    stderr += d.toString();
  });
  var stdout = '';
  child.stdout.on('data', function (d) {
    stdout += d.toString();
  });
  child.on('error', then)
  child.on('close', function (code) {
    if (code!==0) return then(new Error(stderr + stdout))
    then()
  })
}

function get_new_user_id (cb) {
  var cmd = dscl + " . -list /Users UniqueID | awk '{print $2}' | sort -ug | tail -1";
  exec(cmd, function(err, out) {
    if (err) return cb(err);
    cb(null, parseInt(out.toString().trim()) + 1);
  })
}

function get_groups (user, cb) {
  var cmd = dscl + ' . -search /Groups GroupMembership "' + user + '"';

  debug('Getting groups for ' + user);
  exec(cmd, function(err, out) {
    if (err) return cb(err);

    var list = out.toString().split('\n')
      .filter(function(line) {
        return line.match('GroupMembership')
      })
      .map(function(line) {
        return line.split('GroupMembership')[0].trim()
      })
    if (!list.length) return cb(new Error('User "' + user + '" not found'), [])
    cb(null, list);
  })
}

function remove_from_group (user, group_name, cb) {
  var cmd = dscl + ' . -delete "/Groups/' + group_name + '" GroupMembership "' + user + '"';
  debug('Running ' + cmd);
  exec(cmd, cb);
}

function remove_from_groups (user, cb) {
  get_groups(user, function(err, list) {
    if (list.length == 0) return cb();

    var fx = list.map(function(group_name) {
      return function(cb) { remove_from_group(user, group_name, cb) }
    })

    async.parallel(fx, cb);
  })
}

function exists (user, cb) {
  exec('id ' + user, function(e, out, err) {
    var bool = out && !!out.toString().match('(' + user + ')') || false;
    cb(err, bool);
  })
}

function create (opts, cb) {

  var user      = opts.user,
      key       = '/Users/' + user,
      home      = opts.h || opts.home,
      home_dir  = opts.d || opts.home_dir,
      full_name = opts.f || opts.full_name,
      user_id   = opts.i || opts.user_id,
      group_id  = opts.g || opts.group_id || user_id,
      shell     = opts.s || opts.shell || '/bin/bash';

  var groups = opts.groups && opts.groups.split(',')

  if (!user)
    return cb(new Error('User is required.'))

  var todos = [];

  todos.push(function (next) {
    exists(user, function(err, exists) {
      if (exists) return next(new Error('User "' + user + '" already exists.'));
      next();
    });
  })
  todos.push(function (next) {
    if (user_id) return next();
    get_new_user_id(function(err, id) {
      if (err) return next(err);
      user_id = id;
      if (!group_id) group_id = id;
      next();
    })
  })
  todos.push(function (next) {
    sexec(dscl, ['.', 'create', key], next)
  })
  todos.push(function (next) {
    if(!full_name) return next();
    sexec(dscl, ['.', 'create', key, 'RealName', full_name], next)
  })
  todos.push(function (next) {
    if(!shell) return next();
    sexec(dscl, ['.', 'create', key, 'UserShell', shell], next)
  })
  todos.push(function (next) {
    if (!opts.password) return next();
    sexec(dscl, ['.', 'passwd', key, opts.password], next)
  })
  todos.push(function (next) {
    if(!user_id) return next();
    sexec(dscl, ['.', 'create', key, 'UniqueID', user_id], next)
  })
  todos.push(function (next) {
    if(!group_id) return next();
    sexec(dscl, ['.', 'create', key, 'PrimaryGroupID', group_id], next)
  })
  if (groups) {
    groups.forEach(function(group_name) {
      todos.push(function (next) {
        if(!opts.groups) return next();
        sexec(dscl, ['.', 'append', key, 'GroupMembership', group_name], next)
      })
    })
  }
  if (opts.hidden) {
    todos.push(function (next) {
      sexec(dscl, ['.', 'delete', key, 'AuthenticationAuthority'], next)
    })
  } else if (opts.guest) {
    todos.push(function (next) {
      sexec(dscl, ['.', 'create', key, 'dsAttrTypeNative:_guest: true'], next)
    })
  }
  if (home) {
    todos.push(function (next) {
      sexec(dscl, ['.', 'create', key, 'NFSHomeDirectory', home_dir], next)
    })
    home_dir = home_dir || key;
    if (!fs.existsSync(home_dir)) {
      // createhomedir won t work...
      todos.push(function (next) {
        sexec('mkdir', ['-p', home_dir], next)
      })
      todos.push(function (next) {
        sexec('chown', [user_id+':'+group_id, home_dir], next)
      })
    }
  }

  async.series(todos, cb)
}

function remove (user, opts, cb) {

  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  var key  = '/Users/' + user;

  if (!user || user.trim() == '')
    throw new Error('Invalid user name');

  var todos = [];

  todos.push(function (next) {
    exists(user, function(err, exists) {
      if (!exists) return next(new Error('User "' + user + '" does not exist'));
      next();
    });
  })
  todos.push(function (next) {
    remove_from_groups(user, function (err){
      err && console.error(err);
      next();
    })
  })
  if (opts.r || opts.remove) {
    todos.push(function (next) {
      dscacheutil({q: 'user'}, function (err, code, data) {
        data = data.filter(function (d) {
          return d.name===user;
        })
        if(!data.length) return next();
        sexec('rm', ['-fr', data[0].dir], next)
      });
    })
  }
  todos.push(function (next) {
    sexec(edit_group, ['-o', '-delete', user], function (err){
      err && console.error(err);
      next();
    })
  })
  todos.push(function (next) {
    sexec(dscl, ['.', 'delete', key], function (err){
      err && console.error(err);
      next();
    })
  })

  async.series(todos, cb)
}

module.exports = {
  get_groups: get_groups,
  remove_from_group: remove_from_group,
  remove_from_groups: remove_from_groups,
  exists: exists,
  create: create,
  delete: remove,
}

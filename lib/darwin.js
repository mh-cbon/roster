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
var dsclUsers   = require('@mh-cbon/dscl-users')

function get_new_user_id (cb) {
  dsclUsers.newUid (cb)
}

function get_groups (user, cb) {
  dsclUsers.groupsDetails(function (err, items) {
    if (err) return cb(err);
    items = items.filter(function (item) {
      return item['dsAttrTypeStandard:GroupMembership']
        && item['dsAttrTypeStandard:GroupMembership'].indexOf(user)>-1
    }).map(function (item) {
      return item['dsAttrTypeStandard:RecordName'];
    })
    if(!items.length) return cb(new Error('"'+user+'" has no group'))
    cb(null, items);
  })
}

function remove_from_group (user, group_name, cb) {
  dsclUsers.groupRemUser (group_name, user, {}, cb)
}

function remove_from_groups (user, cb) {
  dsclUsers.remUserFromGroups (user, cb)
}

function exists (user, cb) {
  dsclUsers.userExists (user, function (err, exists) {
    if(err) return cb(err);
    if(!exists) return cb(new Error('User "'+user+'" does not exist'))
    cb(err, exists)
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

  var todos = [];
  todos.push(function (next) {
    if (user) return next();
    next(new Error('User is required.'))
  })
  todos.push(function (next) {
    if (user_id) return next();
    dsclUsers.newUid(function(err, id) {
      if (err) return next(err);
      user_id = id;
      if (!group_id) group_id = id;
      next();
    })
  })
  todos.push(function (next) {
    var options = {
      uid:        user_id,
      gid:        group_id,
      password:   opts.password,
      hidden:     opts.hidden,
      guest:      opts.guest,
      full_name:  full_name,
      shell:      shell,
      home_dir:   home && (home_dir || key),
    }
    dsclUsers.userAdd(user, options, next)
  })
  groups && groups.forEach(function(group_name) {
    todos.push(function (next) {
      dsclUsers.groupAddUser (group_name, user, opts, next)
    })
  })

  async.series(todos, cb)
}

function remove (user, opts, cb) {
  dsclUsers.userRemove(user, opts, cb)
}

module.exports = {
  get_groups: get_groups,
  remove_from_group: remove_from_group,
  remove_from_groups: remove_from_groups,
  exists: exists,
  create: create,
  delete: remove,
}

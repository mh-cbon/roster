var windowsNet    = require('@mh-cbon/windows-net');
var async         = require('async')
var randomstring  = require("randomstring");

function get_groups (user, then) {
  windowsNet.userDetails(user, function (err, code, details) {
    if (err) return then(err);
    var groups = []
    .concat(details['Local Group Memberships'])
    .concat(details['Global Group Memberships'])
    then(null, groups);
  })
}
function exists (user, then) {
  windowsNet.userExists(user, then)
}

function create (opts, then) {

  var user      = opts.user,
      password  = opts.p || opts.password || randomstring.generate(7),
      full_name = opts.f || opts.full_name,
      group_id  = opts.g || opts.group_id;

  async.series([
    function (next) {
      windowsNet.userAdd(user, {password: password}, function (err, code) {
        next(err);
      })
    },
    function (next) {
      if(!group_id) return next();
      windowsNet.groupAddUser(group_id, user, {}, function (err, code) {
        next(err);
      })
    },
  ], then)
}

function remove (user, opts, then) {
  async.series([
    function (next) {
      windowsNet.userRemove(user, {}, function (err, code) {
        next(err);
      })
    },
  ], then)
}

module.exports = {
  get_groups: get_groups,
  exists: exists,
  create: create,
  delete: remove,
}

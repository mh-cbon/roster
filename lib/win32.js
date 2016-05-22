function exists (user, cb) {
  return cb(new Error('Not implemented yet.'))
}

function create (opts, cb) {
  return cb(new Error('Not implemented yet.'))
}

function delete (user, cb) {
  return cb(new Error('Not implemented yet.'))
}

module.exports = {
  delete: delete,
  create: create,
  exists: exists,
}

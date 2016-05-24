require('should');

var fs      = require('fs');
var spawn   = require('child_process').spawn;

if (!process.platform.match(/win32/)) return;

describe('roster', function () {

  it('should list user groups', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'groups', 'vagrant']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    var stdout = '';
    child.stdout.on('data', function (d) {
      stdout += d.toString();
    })
    var stderr = '';
    child.stderr.on('data', function (d) {
      stderr += d.toString();
    })
    child.on('close', function (code) {
      code.should.eql(0);
      stdout.should.match(/Administrators/)
      done();
    })
  })

  it('should properly fail to list user groups', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'groups', 'NOPNOPNOPNPO']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(1);
      done();
    })
  })

  it('should tell if an user exists', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'exists', 'vagrant']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    var stdout = '';
    child.stdout.on('data', function (d) {
      stdout += d.toString();
    })
    var stderr = '';
    child.stderr.on('data', function (d) {
      stderr += d.toString();
    })
    child.on('close', function (code) {
      code.should.eql(0);
      done();
    })
  })

  it('should tell if an user does not exist', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'exists', 'NOPNOPNOPNPO']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(1);
      done();
    })
  })

  it('should create an user', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'create', 'some']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(0);
      done();
    })
  })

  it('should properly fails to create an user', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'create', 'some']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(1);
      done();
    })
  })

  it('should delete an user', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'delete', 'some']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(0);
      done();
    })
  })

  it('should properly fail to delete an user', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'delete', 'NONOPNOPNOPN']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      code.should.eql(1);
      done();
    })
  })


})

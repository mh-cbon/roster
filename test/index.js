require('should');

var fs      = require('fs');
var spawn   = require('child_process').spawn;
var sspawn  = require('@mh-cbon/c-yasudo');

if (process.platform.match(/win32/)) return;

describe('roster', function () {

  before(function (done) {
    var home = '/home/other2'
    if(process.platform.match(/darwin/))
      home = '/Users/other2'
    sspawn('rm', ['-fr', home])
    .on('close', function () {
      done();
    })
  })

  after(function (done) {
    var home = '/home/other2'
    if(process.platform.match(/darwin/))
      home = '/Users/other2'
    sspawn('rm', ['-fr', home])
    .on('close', function () {
      done();
    })
  })

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
      if(process.platform.match(/darwin/))
        stdout.should.match(/admin/)
      else
        stdout.should.eql("[ 'vagrant' ]\n")
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

  it('should create an user without home', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'create', 'some']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      var home = '/home/some';
      if(process.platform.match(/darwin/)) home = '/Users/some';
      fs.access(home, fs.F_OK, function (err) {
        err && console.error(err);
        (!err).should.eql(false);
        code.should.eql(0);
        done();
      })
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

  it('should create an user with a home', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'create', 'else', '-h']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      var home = '/home/else';
      if(process.platform.match(/darwin/)) home = '/Users/else';
      fs.access(home, fs.F_OK, function (err) {
        err && console.error(err);
        console.error(!err);
        (!err).should.eql(true);
        code.should.eql(0);
        done();
      })
    })
  })

  it('should create an user with a home into a pre defined directory', function (done) {
    var home = '/home/other2';
    if(process.platform.match(/darwin/)) home = '/Users/other2';
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'create', 'other', '-h', '-d', home]);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      fs.access(home, fs.F_OK, function (err) {
        err && console.error(err);
        (!err).should.eql(true);
        code.should.eql(0);
        done();
      })
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

  it('should delete an user with a home path', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'delete', 'else']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      var home = '/home/else';
      if(process.platform.match(/darwin/)) home = '/Users/else';
      fs.access(home, fs.F_OK, function (err) {
        err && console.error(err);
        (!err).should.eql(true);
        code.should.eql(0);
        done();
      })
    })
  })

  it('should delete an user with a dedicated home path', function (done) {
    var child = spawn(process.argv[0], [__dirname + '/../bin/roster', 'delete', 'other', '-r']);

    child.stdout.pipe(process.stderr);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code) {
      var home = '/home/other2';
      if(process.platform.match(/darwin/)) home = '/Users/other2';
      fs.access(home, fs.F_OK, function (err) {
        err && console.error(err);
        (!err).should.eql(false);
        code.should.eql(0);
        done();
      })
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

var app = require('../../examples/multipart/app')
  , fs = require('fs')
  , request = require('../support/http');

var logo = fs.readFileSync(__dirname+'/../../docs/images/logo.png')
  , boundary = '------expressmultipart';

describe('multipart', function(){
  describe('GET /', function(){
    it('should respond with a form', function(done){
      request(app)
        .get('/')
        .expect(/<form/,done)
    })
  })

  describe('POST /', function(){
    it('should upload logo as multipart', function(done){
      request(app)
        .post('/')
        .set('content-type','multipart/form-data; boundary='+boundary.slice(2))
        .write(boundary+'\r\n')
        .write('Content-Disposition: form-data; name="title"\r\n')
        .write('\r\n')
        .write('logo\r\n')
        .write(boundary+'\r\n')
        .write('Content-Disposition: form-data; name="image"; filename="logo.png"\r\n')
        .write('Content-Type: image/png\r\n')
        .write('\r\n')
        .write(logo+'\r\n')
        .write(boundary+'--\r\n')
        .end(function(res){
          res.body.should.match(/uploaded logo.png/)
          res.body.should.match(/\(12 Kb\)/)
          res.body.should.match(/as logo/)
          done()
        })
    })
  })
})
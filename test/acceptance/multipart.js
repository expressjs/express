
var app = require('../../examples/multipart/app')
  , request = require('../support/http')
  , path = 'test/acceptance/fixtures/grey.png'
  , fs = require('fs')

var logo = fs.readFileSync(path)
  , boundary = '------expressmultipart';

describe('multipart', function(){
  describe('GET /', function(){
    it('should respond with a form', function(done){
      request(app)
        .get('/')
        .expect(/<form/, done)
    })
  })

  describe('POST /', function(){
    it('should upload logo as multipart', function(done){
      request(app)
        .post('/')
        .set('content-type','multipart/form-data; boundary='+boundary.slice(2))
        .write(boundary + '\r\n')
        .write('Content-Disposition: form-data; name="title"\r\n')
        .write('\r\n')
        .write('grey\r\n')
        .write(boundary + '\r\n')
        .write('Content-Disposition: form-data; name="image"; filename="grey.png"\r\n')
        .write('Content-Type: image/png\r\n')
        .write('\r\n')
        .write(logo+'\r\n')
        .write(boundary+'--\r\n')
        .end(function(res){
          res.body.should.match(/uploaded grey.png/)
          res.body.should.match(/\(224 Kb\)/)
          res.body.should.match(/as grey/)
          done()
        })
    })
  })
})
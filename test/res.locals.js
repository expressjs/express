
var express = require('../')
  , request = require('supertest');

describe('res', function(){
  describe('.locals(obj)', function(){
    it('should merge locals', function(done){
      var app = express();

      app.use(function(req, res){
        Object.keys(res.locals).should.eql([]);
        res.locals({ user: 'tobi', age: 1 });
        res.locals.user.should.equal('tobi');
        res.locals.age.should.equal(1);
        res.end();
      });

      request(app)
      .get('/')
      .expect(200, done);
    })
  })

  it('should work when mounted', function(done){
    var app = express();
    var blog = express();

    app.use(blog);

    blog.use(function(req, res, next){
      res.locals.foo = 'bar';
      next();
    });

    app.use(function(req, res){
      res.locals.foo.should.equal('bar');
      res.end();
    });

    request(app)
    .get('/')
    .expect(200, done);
  })
})

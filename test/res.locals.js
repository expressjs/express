
const express = require('../')
const request = require('supertest');

describe('res', function(){
  describe('.locals', function(){
    it('should be empty by default', function(done){
      const app = express();

      app.use(function(req, res){
        Object.keys(res.locals).should.eql([]);
        res.end();
      });

      request(app)
      .get('/')
      .expect(200, done);
    })
  })

  it('should work when mounted', function(done){
    const app = express();
    const blog = express();

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


var request = require('supertest')
  , app = require('../../examples/route-map');

describe('route-map', function(){
  describe('GET /users', function(){
    it('should respond with users', function(done){
      request(app)
      .get('/users')
      .expect('user list', done);
    })
  })

  describe('DELETE /users', function(){
    it('should delete users', function(done){
      request(app)
      .del('/users')
      .expect('delete users', done);
    })
  })

  describe('GET /users/:id', function(){
    it('should get a user', function(done){
      request(app)
      .get('/users/12')
      .expect('user 12', done);
    })
  })

  describe('GET /users/:id/pets', function(){
    it('should get a users pets', function(done){
      request(app)
      .get('/users/12/pets')
      .expect('user 12\'s pets', done);
    })
  })

  describe('GET /users/:id/pets/:pid', function(){
    it('should get a users pet', function(done){
      request(app)
      .del('/users/12/pets/2')
      .expect('delete 12\'s pet 2', done);
    })
  })

  describe('Defend XSS on GET /users/:id', function() {
    it('should escape id', function(done){
      request(app)
      .get('/users/<div%20onload%3D"alert(\'xss\')%3B"><%2Fdiv>')
      .expect('user &lt;div onload=&quot;alert(&#39;xss&#39;);&quot;&gt;&lt;/div&gt;', done);
    })
  })

  describe('Defend XSS on GET /users/:id/pets', function() {
    it('should escape id', function(done){
      request(app)
      .get('/users/<div%20onload%3D"alert(\'xss\')%3B"><%2Fdiv>/pets')
      .expect('user &lt;div onload=&quot;alert(&#39;xss&#39;);&quot;&gt;&lt;/div&gt;\'s pets', done);
    })
  })

  describe('Defend XSS on GET /users/:id/pets/:pid', function() {
    it('should escape id', function(done){
      request(app)
      .delete('/users/<div%20onload%3D"alert(\'xss\')%3B"><%2Fdiv>/pets/1')
      .expect('delete &lt;div onload=&quot;alert(&#39;xss&#39;);&quot;&gt;&lt;/div&gt;\'s pet 1', done);
    })

    it('should escape pid', function(done){
      request(app)
      .delete('/users/1/pets/<div%20onload%3D"alert(\'xss\')%3B"><%2Fdiv>')
      .expect('delete 1\'s pet &lt;div onload=&quot;alert(&#39;xss&#39;);&quot;&gt;&lt;/div&gt;', done);
    })
  })
})

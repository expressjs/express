
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');

var app1 = express();

app1.use(function(req, res, next){
  res.format({
    'text/plain': function(){
      res.send('hey');
    },

    'text/html': function(){
      res.send('<p>hey</p>');
    },

    'application/json': function(a, b, c){
      assert(req == a);
      assert(res == b);
      assert(next == c);
      res.send({ message: 'hey' });
    }
  });
});

app1.use(function(err, req, res, next){
  if (!err.types) throw err;
  res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app2 = express();

app2.use(function(req, res, next){
  res.format({
    text: function(){ res.send('hey') },
    html: function(){ res.send('<p>hey</p>') },
    json: function(){ res.send({ message: 'hey' }) }
  });
});

app2.use(function(err, req, res, next){
  res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app3 = express();

app3.use(function(req, res, next){
  res.format({
    text: function(){ res.send('hey') },
    default: function(){ res.send('default') }
  })
});

var app4 = express();

app4.get('/', function(req, res, next){
  res.format({
    text: function(){ res.send('hey') },
    html: function(){ res.send('<p>hey</p>') },
    json: function(){ res.send({ message: 'hey' }) }
  });
});

app4.use(function(err, req, res, next){
  res.send(err.status, 'Supports: ' + err.types.join(', '));
})

var app5 = express();

app5.use(function (req, res, next) {
  res.format({
    default: function () { res.send('hey') }
  });
});

describe('res', function(){
  describe('.format(obj)', function(){
    describe('with canonicalized mime types', function(){
      test(app1);
    })

    describe('with extnames', function(){
      test(app2);
    })

    describe('with parameters', function(){
      var app = express();

      app.use(function(req, res, next){
        res.format({
          'text/plain; charset=utf-8': function(){ res.send('hey') },
          'text/html; foo=bar; bar=baz': function(){ res.send('<p>hey</p>') },
          'application/json; q=0.5': function(){ res.send({ message: 'hey' }) }
        });
      });

      app.use(function(err, req, res, next){
        res.send(err.status, 'Supports: ' + err.types.join(', '));
      });

      test(app);
    })

    describe('given .default', function(){
      it('should be invoked instead of auto-responding', function(done){
        request(app3)
        .get('/')
        .set('Accept', 'text/html')
        .expect('default', done);
      })

      it('should work when only .default is provided', function (done) {
        request(app5)
        .get('/')
        .set('Accept', '*/*')
        .expect('hey', done);
      })
    })

    describe('in router', function(){
      test(app4);
    })

    describe('in router', function(){
      var app = express();
      var router = express.Router();

      router.get('/', function(req, res, next){
        res.format({
          text: function(){ res.send('hey') },
          html: function(){ res.send('<p>hey</p>') },
          json: function(){ res.send({ message: 'hey' }) }
        });
      });

      router.use(function(err, req, res, next){
        res.send(err.status, 'Supports: ' + err.types.join(', '));
      })

      app.use(router)

      test(app)
    })
  })
})

function test(app) {
  it('should utilize qvalues in negotiation', function(done){
    request(app)
    .get('/')
    .set('Accept', 'text/html; q=.5, application/json, */*; q=.1')
    .expect({"message":"hey"}, done);
  })

  it('should allow wildcard type/subtypes', function(done){
    request(app)
    .get('/')
    .set('Accept', 'text/html; q=.5, application/*, */*; q=.1')
    .expect({"message":"hey"}, done);
  })

  it('should default the Content-Type', function(done){
    request(app)
    .get('/')
    .set('Accept', 'text/html; q=.5, text/plain')
    .expect('Content-Type', 'text/plain; charset=utf-8')
    .expect('hey', done);
  })

  it('should set the correct  charset for the Content-Type', function() {
    request(app)
    .get('/')
    .set('Accept', 'text/html')
    .expect('Content-Type', 'text/html; charset=utf-8');

    request(app)
    .get('/')
    .set('Accept', 'text/plain')
    .expect('Content-Type', 'text/plain; charset=utf-8');

    request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json');
  })

  it('should Vary: Accept', function(done){
    request(app)
    .get('/')
    .set('Accept', 'text/html; q=.5, text/plain')
    .expect('Vary', 'Accept', done);
  })

  describe('when Accept is not present', function(){
    it('should invoke the first callback', function(done){
      request(app)
      .get('/')
      .expect('hey', done);
    })
  })

  describe('when no match is made', function(){
    it('should should respond with 406 not acceptable', function(done){
      request(app)
      .get('/')
      .set('Accept', 'foo/bar')
      .expect('Supports: text/plain, text/html, application/json')
      .expect(406, done)
    })
  })
}

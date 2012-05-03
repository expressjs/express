
var express = require('../')
  , request = require('./support/http');

describe('res', function(){
  describe('.locals.use(fn)', function(){
    it('should run in parallel on res.render()', function(done){
      var app = express();
      var calls = [];
      app.set('views', __dirname + '/fixtures');

      app.locals.first = 'tobi';

      app.use(function(req, res, next){
        res.locals.use(function(req, res, done){
          process.nextTick(function(){
            calls.push('one');
            res.locals.last = 'holowaychuk';
            done();
          });
        });
        next();
      });

      app.use(function(req, res, next){
        res.locals.use(function(req, res, done){
          process.nextTick(function(){
            calls.push('two');
            res.locals.species = 'ferret';
            done();
          });
        });
        next();
      });

      app.use(function(req, res){
        calls.push('render');
        res.render('pet.jade');
      });
      
      request(app)
      .get('/')
      .end(function(res){
        calls.should.eql(['render', 'one', 'two']);
        res.body.should.equal('<p>tobi holowaychuk is a ferret</p>');
        done();
      })
    })
    
    describe('with arity < 3', function(){
      it('should done() for you', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');
        app.locals.first = 'tobi';

        app.use(function(req, res, next){
          res.locals.use(function(req, res){
            res.locals.last = 'holowaychuk';
            res.locals.species = 'ferret';
          });
          next();
        });

        app.use(function(req, res){
          res.render('pet.jade');
        });

        request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('<p>tobi holowaychuk is a ferret</p>');
          done();
        })
      })
    })

    it('should not override res.render() locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.first = 'tobi';

      app.use(function(req, res, next){
        res.locals.use(function(req, res){
          res.locals.last = 'holowaychuk';
          res.locals.species = 'ferret';
        });
        next();
      });

      app.use(function(req, res){
        res.render('pet.jade', { last: 'ibot' });
      });

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('<p>tobi ibot is a ferret</p>');
        done();
      })
    })
  })
})

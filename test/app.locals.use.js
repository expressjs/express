
var express = require('../')
  , request = require('./support/http');

describe('app', function(){
  describe('.locals.use(fn)', function(){
    it('should run in parallel on res.render()', function(done){
      var app = express();
      var calls = [];
      app.set('views', __dirname + '/fixtures');

      app.locals.first = 'tobi';

      app.locals.use(function(req, res, done){
        process.nextTick(function(){
          calls.push('one');
          res.locals.last = 'holowaychuk';
          done();
        });
      });
      
      app.locals.use(function(req, res, done){
        process.nextTick(function(){
          calls.push('two');
          res.locals.species = 'ferret';
          done();
        });
      });

      app.use(function(req, res){
        calls.push('use');
        res.render('pet.jade');
      });
      
      request(app)
      .get('/')
      .end(function(err, res){
        if (err) return done(err);
        calls.should.eql(['use', 'one', 'two']);
        res.text.should.equal('<p>tobi holowaychuk is a ferret</p>');
        done();
      })
    })
    
    describe('with arity < 3', function(){
      it('should done() for you', function(done){
        var app = express();

        app.set('views', __dirname + '/fixtures');
        app.locals.first = 'tobi';

        app.locals.use(function(req, res){
          res.locals.last = 'holowaychuk';
          res.locals.species = 'ferret';
        });

        app.use(function(req, res){
          res.render('pet.jade');
        });

        request(app)
        .get('/')
        .expect('<p>tobi holowaychuk is a ferret</p>', done);
      })
    })

    it('should not override res.render() locals', function(done){
      var app = express();

      app.set('views', __dirname + '/fixtures');
      app.locals.first = 'tobi';

      app.locals.use(function(req, res){
        res.locals.last = 'holowaychuk';
        res.locals.species = 'ferret';
      });

      app.use(function(req, res){
        res.render('pet.jade', { last: 'ibot' });
      });

      request(app)
      .get('/')
      .expect('<p>tobi ibot is a ferret</p>', done);
    })

    it('should work when mounted', function(done){
      var app = express();
      var pet = express();

      app.set('views', __dirname + '/fixtures');

      app.locals.first = 'tobi';
      
      app.locals.use(function(req, res){
        res.locals.last = 'holowaychuk';
      });

      pet.locals.use(function(req, res){
        res.locals.species = 'ferret';
      });
      
      app.use(function(req, res){
        res.render('pet.jade');
      });

      app.use(pet);

      request(app)
      .get('/')
      .expect('<p>tobi holowaychuk is a ferret</p>', done);
    })
  })
})

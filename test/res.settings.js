
var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.settings', function(){
    it('should override app setting', function(done){
      var app = express();
      app.set('json spaces', 2);
      app.get('/', function(req, res){
        res.settings['json spaces'] = 4;
        res.json({a:'b'});
      });
      request(app)
      .get('/')
      .expect(200, '{\n    "a": "b"\n}', done);
    })

    it('should default to app setting if not overridden', function(done){
      var app = express();
      app.set('json spaces', 2);
      app.get('/', function(req, res){
        res.send(res.settings['json spaces']);
      });
      request(app)
      .get('/')
      .expect(200, '2', done)
    })

    describe('when performing a series of requests', function(){
      var app = express();
      app.set('json spaces', 2);
      app.get('/', function(req, res){
        res.settings['json spaces'] = 4;
        res.json({a:'b'});
      });
      app.get('/other', function(req, res){
        res.json({a:'b'});
      });

      it('should affect settings on the request it is set', function(done){
        request(app)
        .get('/')
        .expect(200, '{\n    "a": "b"\n}', done);
      })

      it('should not affect settings for other requests', function(done){
        request(app)
        .get('/other')
        .expect(200, '{\n  "a": "b"\n}', done);
      })
    }) 

    describe('when "views" is overridden', function(){
      var app = express();
      var count = 0;

      function View(name, options){
        this.name = name;
        this.path = options.root;
        count++;
      }

      View.prototype.render = function(options, fn){
        fn(null, this.path);
      };

      app.set('view cache', true);
      app.set('views', '/a');
      app.set('view', View);

      app.get('/:use_b', function(req, res) {
        if (req.params.use_b === 'true') {
          res.settings['views'] = '/b';
        }
        res.render('index');
      });

      it('should render distinct views with the same name and different "views"', function(done){
        request(app)
        .get('/false')
        .expect(200, '/a', function(err, res) {
          if (err) return done(err);
          count.should.equal(1);
          request(app)
          .get('/true')
          .expect(200, '/b', function(err, res) {
            if (err) return done(err);
            count.should.equal(2);
            done();
          });
        });
      });

      it('should cache views with the same name and "views"', function(done){
        request(app)
        .get('/false')
        .expect(200, '/a', function(err, res) {
          if (err) return done(err);
          count.should.equal(2);
          request(app)
          .get('/true')
          .expect(200, '/b', function(err, res) {
            if (err) return done(err);
            count.should.equal(2);
            done();
          });
        });
      })
    })

    describe('with mounted app', function(){
      it('should default to mounted application settings', function(done){
        var app = express();
        app.set('json spaces', 2);
        var app2 = express();
        app2.set('json spaces', 4);
        app2.get('/', function(req, res) {
          res.json({a:'b'});
        });
        app.use('/inner', app2);

        request(app)
        .get('/inner')
        .expect(200, '{\n    "a": "b"\n}', done);
      })

      it('should retain any overridden settings from parent', function(done){
        var app = express();
        app.use('/', function(req, res, next) {
          res.settings['json spaces'] = 4;
          next();
        });
        var app2 = express();
        app2.get('/', function(req, res) {
          res.json({a:'b'});
        });
        app.use('/inner', app2);

        request(app)
        .get('/inner')
        .expect(200, '{\n    "a": "b"\n}', done);
      })

      it('should default to parent app settings again', function(done){
        var app = express();
        app.set('json spaces', 2);
        var app2 = express();
        app2.set('json spaces', 4);
        app2.use('/', function(req, res, next) {
          res.set('x-ran-inner-middleware', 'true');
          next();
        });
        app2.get('/', function(req, res) {
          res.json({a:'b'});
        });
        app.use('/inner', app2);
        app.get('/inner/not_really', function(req, res) {
          res.json({c:'d'});
        });

        request(app)
        .get('/inner/not_really')
        .expect('x-ran-inner-middleware', 'true')
        .expect(200, '{\n  "c": "d"\n}', done);
      })
    })
  })
})

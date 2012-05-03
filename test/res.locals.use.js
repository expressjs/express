var express = require('../')
  , request = require('./support/http');

describe('res', function () {
  describe('.locals.use(fn)', function () {
    it('should render', function(done) {
      var app = express();

      app.set('views', __dirname + '/fixtures');

      app.use(function(req, res) {
        res.locals.use(function(req, res, done) {
          process.nextTick(function(){
            res.locals.first = 'tobi';
            done();
          });
        });

        res.locals.use(function(req, res, done) {
          process.nextTick(function(){
            res.locals.last = 'holowaychuk';
            done();
          });
        });

        res.locals.use(function(req, res, done) {
          process.nextTick(function(){
            res.locals.species = 'ferret';
            done();
          });
        });

        res.render('pet.jade');
      })

      request(app)
      .get('/')
      .end(function(res){
        res.body.should.equal('<p>tobi holowaychuk is a ferret</p>');
        done();
      })
    })
  })
})

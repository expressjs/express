
var express = require('../')
  , request = require('supertest');


function getExpectedClientAddress(server) {
  /*
   * By default, Node.js will listen on an IPv6 socket if it works
   * on the host. However, supertest currently connects to the server
   * using an IPv4 address, so in this case we expect req.ip to be
   * the IPv6 IPv4-mapped loopback address. If IPv6 is not available,
   * then Node.js will bind to an IPv4 address, and req.ip will then
   * be an IPv4 address too.
   */
  var expectedClientAddr = '127.0.0.1';
  if (server.address().address === '::') {
    expectedClientAddr = '::ffff:' + expectedClientAddr;
  }

  return expectedClientAddr;
}

describe('req', function(){
  describe('.ip', function(){
    describe('when X-Forwarded-For is present', function(){
      describe('when "trust proxy" is enabled', function(){
        it('should return the client addr', function(done){
          var app = express();

          app.enable('trust proxy');

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('client', done);
        })

        it('should return the addr after trusted proxy', function(done){
          var app = express();

          app.set('trust proxy', 2);

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('p1', done);
        })
      })

      describe('when "trust proxy" is disabled', function(){
        it('should return the remote address', function(done){
          var app = express();

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          var server = app.listen(function() {
            request(server)
            .get('/')
            .set('X-Forwarded-For', 'client, p1, p2')
            .expect(getExpectedClientAddress(server), function(err) {
              server.close(function() {
                done(err);
              })
            });
          });

        })
      })
    })

    describe('when X-Forwarded-For is not present', function(){
      it('should return the remote address', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        var server = app.listen(function() {
          request(server)
          .get('/')
          .expect(getExpectedClientAddress(server), function(err) {
            server.close(function() {
              done(err);
            })
          });
        });

      })
    })
  })
})

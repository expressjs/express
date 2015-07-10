
var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.links(obj)', function(){
    it('should set Link header field by passing an object', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        });
        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"')
      .expect(200, done);
    })

    it('should set Link header field for multiple calls by passing an object', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links({
          next: 'http://api.example.com/users?page=2',
          last: 'http://api.example.com/users?page=5'
        });

        res.links({
          prev: 'http://api.example.com/users?page=1'
        });

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last", <http://api.example.com/users?page=1>; rel="prev"')
      .expect(200, done);
    })
  })
  
  describe('.links(array)', function(){
    it('should set Link header field by passing an array of objects', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links([{
            href: 'http://api.example.com/users?page=2',
            rel: 'next',
            title: 'next chapter',
            type: 'text/plain;charset=UTF-8'
        }, {
            href: 'http://api.example.com/users?page=5',
            rel: 'last',
            title: 'last chapter',
            type: 'text/plain;charset=UTF-8'
        }]);
        
        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next"; title="next chapter"; type="text/plain;charset=UTF-8", <http://api.example.com/users?page=5>; rel="last"; title="last chapter"; type="text/plain;charset=UTF-8"')
      .expect(200, done);
    })

    it('should set Link header field for multiple calls by passing an array of objects', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links([{
            href: 'http://api.example.com/users?page=2',
            rel: 'next',
            title: 'next chapter',
            type: 'text/plain;charset=UTF-8'
        }, {
            href: 'http://api.example.com/users?page=5',
            rel: 'last',
            title: 'last chapter',
            type: 'text/plain;charset=UTF-8'
        }]);

        res.links([{
                href: 'http://api.example.com/users?page=1',
                rel: 'prev',
                title: 'previous',
                type: 'text/plain;charset=UTF-8'
        }]);

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next"; title="next chapter"; type="text/plain;charset=UTF-8", <http://api.example.com/users?page=5>; rel="last"; title="last chapter"; type="text/plain;charset=UTF-8", <http://api.example.com/users?page=1>; rel="prev"; title="previous"; type="text/plain;charset=UTF-8"')
      .expect(200, done);
    })

    it('should ignore invalid keys from the config object.', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.links([{
            href: 'http://api.example.com/users?page=2',
            rel: 'next',
            '>>>>>': 'bad key',
            title: 'next chapter',
            'title*': 'title in another charset',
            type: 'text/plain;charset=UTF-8'
        }, {
            href: 'http://api.example.com/users?page=5',
            rel: 'last',
            '*': 'bad key',
            '12543': 'bad key',
            title: 'last chapter',
            type: 'text/plain;charset=UTF-8'
        }]);

        res.end();
      });

      request(app)
      .get('/')
      .expect('Link', '<http://api.example.com/users?page=2>; rel="next"; title="next chapter"; title*="title in another charset"; type="text/plain;charset=UTF-8", <http://api.example.com/users?page=5>; rel="last"; title="last chapter"; type="text/plain;charset=UTF-8"')
      .expect(200, done);
    })

  })

})

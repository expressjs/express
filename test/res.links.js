
var express = require('..');
var request = require('supertest');

describe('res', function(){
  describe('.links(obj)', function(){
    it('should set Link header field', function (done) {
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

    it('should set Link header field for multiple calls', function (done) {
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
  })
})

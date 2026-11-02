'use strict';

var assert = require('node:assert');
var methods = require('node:http').METHODS;
var express = require('../');
var request = require('supertest');

describe('app.listRoutes()', function () {
  it('should return an empty array for a new application', function () {
    var app = express();

    assert.deepStrictEqual(app.listRoutes(), []);
  });

  it('should list routes registered through the application APIs', function () {
    var app = express();

    app.get('/users', noop);
    app.route('/posts').get(noop).all(noop).post(noop);
    app.route('/draft');

    assert.deepStrictEqual(app.listRoutes(), [
      { path: '/users', methods: ['GET', 'HEAD'], router: undefined },
      { path: '/posts', methods: ['GET', '*', 'POST', 'HEAD'], router: undefined },
      { path: '/draft', methods: [], router: undefined }
    ]);
  });

  it('should list the individual HTTP methods registered by app.all()', function () {
    var app = express();

    app.all('/all', noop);
    app.route('/wildcard').all(noop);

    assert.deepStrictEqual(app.listRoutes(), [
      { path: '/all', methods: methods, router: undefined },
      { path: '/wildcard', methods: ['*'], router: undefined }
    ]);
  });

  it('should expose mounted routers for separate inspection', function () {
    var app = express();
    var router = express.Router();

    router.all('/users', noop);
    app.use('/api', router);

    var routes = app.listRoutes();

    assert.deepStrictEqual(routes, [
      { path: '/api', methods: undefined, router: router }
    ]);
    assert.deepStrictEqual(routes[0].router.listRoutes(), [
      { path: '/users', methods: ['*'], router: undefined }
    ]);
  });

  it('should omit plain middleware', function () {
    var app = express();

    app.use(noop);
    app.use('/admin', noop);
    app.get('/users', noop);

    assert.deepStrictEqual(app.listRoutes(), [
      { path: '/users', methods: ['GET', 'HEAD'], router: undefined }
    ]);
  });

  it('should expose the router of a mounted sub-application', function () {
    var app = express();
    var admin = express();

    admin.get('/users', noop);
    app.use('/admin', admin);

    var routes = app.listRoutes();

    assert.deepStrictEqual(routes, [
      { path: '/admin', methods: undefined, router: admin.router }
    ]);
    assert.deepStrictEqual(app.router.listRoutes(), routes);
    assert.deepStrictEqual(routes[0].router.listRoutes(), [
      { path: '/users', methods: ['GET', 'HEAD'], router: undefined }
    ]);
  });

  it('should preserve registration order and the paths of sub-application mounts', function () {
    var app = express();
    var admin = express();
    var path = /^\/admin/;

    app.get('/before', noop);
    app.use(admin);
    app.use(['/one', ['/two']], admin);
    app.use(path, admin);
    app.get('/after', noop);

    assert.deepStrictEqual(app.listRoutes(), [
      { path: '/before', methods: ['GET', 'HEAD'], router: undefined },
      { path: '/', methods: undefined, router: admin.router },
      { path: '/one', methods: undefined, router: admin.router },
      { path: '/two', methods: undefined, router: admin.router },
      { path: path, methods: undefined, router: admin.router },
      { path: '/after', methods: ['GET', 'HEAD'], router: undefined }
    ]);
  });

  it('should allow inspection of nested sub-applications through their routers', function () {
    var app = express();
    var api = express();
    var admin = express();

    app.use('/api', api);
    api.use('/admin', admin);
    admin.get('/users', noop);

    var apiRouter = app.listRoutes()[0].router;
    assert.strictEqual(apiRouter, api.router);
    assert.deepStrictEqual(apiRouter.listRoutes(), [
      { path: '/admin', methods: undefined, router: admin.router }
    ]);
    assert.deepStrictEqual(apiRouter.listRoutes()[0].router.listRoutes(), [
      { path: '/users', methods: ['GET', 'HEAD'], router: undefined }
    ]);
  });

  it('should expose sub-applications mounted directly on an express.Router()', function () {
    var app = express();
    var router = express.Router();
    var admin = express();

    app.use('/api', router);
    router.use('/admin', admin);
    admin.get('/users', noop);

    assert.deepStrictEqual(app.listRoutes()[0].router.listRoutes(), [
      { path: '/admin', methods: undefined, router: admin.router }
    ]);
  });

  it('should reflect routes added after inspecting an empty mounted sub-application', function () {
    var app = express();
    var admin = express();

    app.use('/admin', admin);

    var mountedRouter = app.listRoutes()[0].router;
    assert.strictEqual(mountedRouter, admin.router);
    assert.deepStrictEqual(mountedRouter.listRoutes(), []);

    admin.get('/users', noop);

    assert.deepStrictEqual(mountedRouter.listRoutes(), [
      { path: '/users', methods: ['GET', 'HEAD'], router: undefined }
    ]);
  });

  it('should defer router creation until after mounting and configuration', function (done) {
    var app = express();
    var admin = express();

    admin.on('mount', function () {
      this.enable('case sensitive routing');
    });
    app.use('/admin', admin);
    admin.enable('strict routing');
    admin.get('/Users', function (req, res) {
      res.send('users');
    });

    var mountedRouter = app.listRoutes()[0].router;
    assert.strictEqual(mountedRouter, admin.router);
    assert.strictEqual(mountedRouter.caseSensitive, true);
    assert.strictEqual(mountedRouter.strict, true);

    request(app).get('/admin/users').expect(404, done);
  });

  it('should preserve sub-application dispatch and restore the parent application', function (done) {
    var app = express();
    var admin = express();

    app.request.scope = function () { return 'parent'; };
    admin.request.scope = function () { return 'child'; };
    app.response.scope = function () { return 'parent'; };
    admin.response.scope = function () { return 'child'; };

    admin.get('/users', function (req, res, next) {
      assert.strictEqual(req.app, admin);
      assert.strictEqual(res.app, admin);
      assert.strictEqual(req.scope(), 'child');
      assert.strictEqual(res.scope(), 'child');
      res.setHeader('x-subapp', 'hit');
      next();
    });
    app.use('/admin', admin);
    app.use(function (req, res) {
      assert.strictEqual(req.app, app);
      assert.strictEqual(res.app, app);
      assert.strictEqual(req.scope(), 'parent');
      assert.strictEqual(res.scope(), 'parent');
      res.send('parent');
    });

    assert.strictEqual(app.listRoutes()[0].router, admin.router);

    request(app).get('/admin/users')
      .expect('x-subapp', 'hit')
      .expect(200, 'parent', done);
  });
});

function noop() {}

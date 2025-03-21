import * as express from '../index';
import * as http from 'http';
import * as ejs from 'ejs';
import { Request, ParamsArray, ParamsDictionary } from '../core';
import { expectTypeOf } from 'expect-type';

namespace express_tests {
  const app = express();

  expectTypeOf(app.engine).toBeCallableWith('html', ejs.renderFile);

  expectTypeOf(express.static.mime.define).toBeCallableWith({
    'application/fx': ['fx']
  });
  expectTypeOf(app.use).toBeCallableWith('/static', express.static(__dirname + '/public'));

  // Simple logger
  app.use((req, res, next) => {
    expectTypeOf(console.log).toBeCallableWith('%s %s', req.method, req.url);
    expectTypeOf(next).toBeCallableWith();
  });

  expectTypeOf(app.use).toBeCallableWith((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    expectTypeOf(console.error).toBeCallableWith(err);
    expectTypeOf(next).toBeCallableWith(err);
  });

  app.get('/', (req, res) => {
    expectTypeOf(res.send).toBeCallableWith('hello world');
  });

  // Accept json app-wide or on one endpoint.
  expectTypeOf(app.use).toBeCallableWith(express.json({ limit: "200kb" }));
  app.post('/echo', express.json(), (req, res) => {
    expectTypeOf(res.json).toBeCallableWith(req.body);
  });

  // Accept urlencoded app-wide or on one endpoint.
  expectTypeOf(app.use).toBeCallableWith(express.urlencoded({
    extended: false,
    parameterLimit: 16
  }));
  app.post('/search', express.urlencoded(), (req, res) => {
    expectTypeOf(res.json).toBeCallableWith(Object.keys(req.body));
  });

  const router = express.Router({ caseSensitive: true, mergeParams: true, strict: true });

  expectTypeOf(router.get).toBeCallableWith('test');
  expectTypeOf(router.put).toBeCallableWith('test');
  expectTypeOf(router.post).toBeCallableWith('test');
  expectTypeOf(router.delete).toBeCallableWith('test');
  expectTypeOf(router.get).toBeCallableWith(/test/);
  expectTypeOf(router.put).toBeCallableWith(/test/);
  expectTypeOf(router.post).toBeCallableWith(/test/);
  expectTypeOf(router.delete).toBeCallableWith(/test/);


  router.use((req, res, next) => {
    expectTypeOf(next).toBeCallableWith();
  });

  router.route('/users')
    .get((req, res, next) => {
      expectTypeOf(req.accepts()).toEqualTypeOf<string[]>();
      expectTypeOf(req.accepts(['json', 'text'])).toEqualTypeOf<string | false>();
      expectTypeOf(req.accepts('json', 'text')).toEqualTypeOf<string | false>();

      expectTypeOf(req.acceptsCharsets()).toEqualTypeOf<string[]>();
      expectTypeOf(req.acceptsCharsets(['utf-8', 'utf-16'])).toEqualTypeOf<string | false>();
      expectTypeOf(req.acceptsCharsets('utf-8', 'utf-16')).toEqualTypeOf<string | false>();

      expectTypeOf(req.acceptsEncodings()).toEqualTypeOf<string[]>();
      expectTypeOf(req.acceptsEncodings(['gzip', 'deflate'])).toEqualTypeOf<string | false>();
      expectTypeOf(req.acceptsEncodings('gzip', 'deflate')).toEqualTypeOf<string | false>();

      expectTypeOf(req.acceptsLanguages()).toEqualTypeOf<string[]>();
      expectTypeOf(req.acceptsLanguages(['en', 'ja'])).toEqualTypeOf<string | false>();
      expectTypeOf(req.acceptsLanguages('en', 'ja')).toEqualTypeOf<string | false>();

      expectTypeOf(req.get('set-cookie')).toEqualTypeOf<string[] | undefined>();
      expectTypeOf(req.header('header')).toEqualTypeOf<string | undefined>();

      expectTypeOf(req.headers.existingHeader).toEqualTypeOf<string | string[] | undefined>();

      // Since 4.14.0 req.range() has options
      expectTypeOf(req.range).toBeCallableWith(2, { combine: true });

      expectTypeOf(res.send).toBeCallableWith(req.query['token']);
    });

  router.get('/user/:id', (req, res, next) => {
    expectTypeOf(next).toBeCallableWith('route');
    expectTypeOf(next).toBeCallableWith('router');
    expectTypeOf(next).toBeCallableWith();
    expectTypeOf(next).toBeCallableWith(new Error('test'));
  }, (req, res, next) => {
    expectTypeOf(res.render).toBeCallableWith('regular');
  });

  // Params defaults to dictionary
  router.get('/:foo', req => {
    expectTypeOf(req.params.foo).toBeString();
    expectTypeOf(req.params).not.toBeArray();
  });

  // Params can be used as an array
  router.get<ParamsArray>('/*', req => {
    expectTypeOf(req.params[0]).toBeString();
    expectTypeOf(req.params.length).toBeNumber();
  });

  // Params can be used as an array and can be specified via an explicit param type (core)
  router.get('/*', (req: Request<ParamsArray>) => {
    expectTypeOf(req.params[0]).toBeString();
    expectTypeOf(req.params.length).toBeNumber();
  });

  // Params can be used as an array and can be specified via an explicit param type (express)
  router.get('/*', (req: express.Request<ParamsArray>) => {
    expectTypeOf(req.params[0]).toBeString();
    expectTypeOf(req.params.length).toBeNumber();
  });

  // Params can be a custom type that conforms to constraint
  router.get<{ foo: string }>('/:foo', req => {
    expectTypeOf(req.params.foo).toBeString();
    expectTypeOf(req.params).not.toHaveProperty("bar");
  });

  // Params can be a custom type that conforms to constraint and can be specified via an explicit param type (core)
  router.get('/:foo', (req: Request<{ foo: string }>) => {
    expectTypeOf(req.params.foo).toBeString();
    expectTypeOf(req.params).not.toHaveProperty("bar");
  });

  // Params can be a custom type that conforms to constraint and can be specified via an explicit param type (express)
  router.get('/:foo', (req: express.Request<{ foo: string }>) => {
    expectTypeOf(req.params.foo).toBeString();
    expectTypeOf(req.params).not.toHaveProperty("bar");
  });

  // Params cannot be a custom type that does not conform to constraint
  expectTypeOf<{ foo: number }>().not.toExtend<ParamsDictionary>();

  // Response will default to any type
  router.get("/", (req: Request, res: express.Response) => {
    expectTypeOf(res.json).toBeCallableWith({});
  });

  // Response will be of Type provided
  router.get("/", (req: Request, res: express.Response<string>) => {
    expectTypeOf(res.json).toBeCallableWith();
    expectTypeOf(res.json).parameter(0).exclude(undefined).toBeString();
    expectTypeOf(res.send).parameter(0).exclude(undefined).toBeString();
  });

  // Router is a handler
  app.use((req, res, next) => {
    expectTypeOf(router).toBeCallableWith(req, res, next);
  });

  // Test append function
  app.use((req, res, next) => {
    expectTypeOf(res.append).toBeCallableWith('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
    expectTypeOf(res.append).toBeCallableWith('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
    expectTypeOf(res.append).toBeCallableWith('Warning', '199 Miscellaneous warning');
  });

  expectTypeOf(app.use).toBeCallableWith(router);

  // Test req.res, req.next, res.req should exist after middleware.init
  app.use((req, res) => {
    expectTypeOf(req).toHaveProperty("res");
    expectTypeOf(req).toHaveProperty("next");
    expectTypeOf(res).toHaveProperty("req");
  });

  // Test mounting sub-apps
  expectTypeOf(app.use).toBeCallableWith('/sub-app', express());

  // Test on mount event
  expectTypeOf(app.on).toBeCallableWith('mount', (parent) => true);

  // Test mount path
  expectTypeOf(app.mountpath).toEqualTypeOf<string | string[]>();

  expectTypeOf(app.listen).toBeCallableWith(3000);

  expectTypeOf<express.NextFunction>().toExtend<() => void>();
}

/***************************
 *                         *
 * Test with other modules *
 *                         *
 ***************************/

namespace node_tests {
  // http.createServer can take express application
  expectTypeOf(express).returns.toExtend<express.Application>();
  expectTypeOf(http.createServer).toBeCallableWith(express());
}

#!/usr/bin/env node

/**
 * Module dependencies.
 */

var exec = require('child_process').exec
  , program = require('commander')
  , mkdirp = require('mkdirp')
  , pkg = require('../package.json')
  , version = pkg.version
  , os = require('os')
  , fs = require('fs');

// CLI

program
  .version(version)
  .option('-s, --sessions', 'add session support')
  .option('-e, --ejs', 'add ejs engine support (defaults to jade)')
  .option('-J, --jshtml', 'add jshtml engine support (defaults to jade)')
  .option('-H, --hogan', 'add hogan.js engine support')
  .option('-c, --css <engine>', 'add stylesheet <engine> support (less|stylus) (defaults to plain css)')
  .option('-f, --force', 'force on non-empty directory')
  .parse(process.argv);

// Path

var path = program.args.shift() || '.';

// end-of-line code

var eol = 'win32' == os.platform() ? '\r\n' : '\n'

// Template engine

program.template = 'jade';
if (program.ejs) program.template = 'ejs';
if (program.jshtml) program.template = 'jshtml';
if (program.hogan) program.template = 'hjs';

/**
 * Routes index template.
 */

var index = [
    ''
  , '/*'
  , ' * GET home page.'
  , ' */'
  , ''
  , 'exports.index = function(req, res){'
  , '  res.render(\'index\', { title: \'Express\' });'
  , '};'
].join(eol);

/**
 * Routes users template.
 */

var users = [
    ''
  , '/*'
  , ' * GET users listing.'
  , ' */'
  , ''
  , 'exports.list = function(req, res){'
  , '  res.send("respond with a resource");'
  , '};'
].join(eol);

/**
 * Jade layout template.
 */

var jadeLayout = [
    'doctype 5'
  , 'html'
  , '  head'
  , '    title= title'
  , '    link(rel=\'stylesheet\', href=\'/stylesheets/style.css\')'
  , '  body'
  , '    block content'
].join(eol);

/**
 * Jade index template.
 */

var jadeIndex = [
    'extends layout'
  , ''
  , 'block content'
  , '  h1= title'
  , '  p Welcome to #{title}'
].join(eol);

/**
 * EJS index template.
 */

var ejsIndex = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title><%= title %></title>'
  , '    <link rel=\'stylesheet\' href=\'/stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    <h1><%= title %></h1>'
  , '    <p>Welcome to <%= title %></p>'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * JSHTML layout template.
 */

var jshtmlLayout = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title> @write(title) </title>'
  , '    <link rel=\'stylesheet\' href=\'/stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    @write(body)'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * JSHTML index template.
 */

var jshtmlIndex = [
    '<h1>@write(title)</h1>'
  , '<p>Welcome to @write(title)</p>'
].join(eol);

/**
 * Hogan.js index template.
 */
var hoganIndex = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title>{{ title }}</title>'
  , '    <link rel=\'stylesheet\' href=\'/stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    <h1>{{ title }}</h1>'
  , '    <p>Welcome to {{ title }}</p>'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * Default css template.
 */

var css = [
    'body {'
  , '  padding: 50px;'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;'
  , '}'
  , ''
  , 'a {'
  , '  color: #00B7FF;'
  , '}'
].join(eol);

/**
 * Default less template.
 */

var less = [
    'body {'
  , '  padding: 50px;'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;'
  , '}'
  , ''
  , 'a {'
  , '  color: #00B7FF;'
  , '}'
].join(eol);

/**
 * Default stylus template.
 */

var stylus = [
    'body'
  , '  padding: 50px'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif'
  , 'a'
  , '  color: #00B7FF'
].join(eol);

/**
 * App template.
 */

var app = [
    ''
  , '/**'
  , ' * Module dependencies.'
  , ' */'
  , ''
  , 'var express = require(\'express\')'
  , '  , routes = require(\'./routes\')'
  , '  , user = require(\'./routes/user\')'
  , '  , http = require(\'http\')'
  , '  , path = require(\'path\');'
  , ''
  , 'var app = express();'
  , ''
  , 'app.configure(function(){'
  , '  app.set(\'port\', process.env.PORT || 3000);'
  , '  app.set(\'views\', __dirname + \'/views\');'
  , '  app.set(\'view engine\', \':TEMPLATE\');'
  , '  app.use(express.favicon());'
  , '  app.use(express.logger(\'dev\'));'
  , '  app.use(express.bodyParser());'
  , '  app.use(express.methodOverride());{sess}'
  , '  app.use(app.router);{css}'
  , '  app.use(express.static(path.join(__dirname, \'public\')));'
  , '});'
  , ''
  , 'app.configure(\'development\', function(){'
  , '  app.use(express.errorHandler());'
  , '});'
  , ''
  , 'app.get(\'/\', routes.index);'
  , 'app.get(\'/users\', user.list);'
  , ''
  , 'http.createServer(app).listen(app.get(\'port\'), function(){'
  , '  console.log("Express server listening on port " + app.get(\'port\'));'
  , '});'
  , ''
].join(eol);

// Generate application

(function createApplication(path) {
  emptyDirectory(path, function(empty){
    if (empty || program.force) {
      createApplicationAt(path);
    } else {
      program.confirm('destination is not empty, continue? ', function(ok){
        if (ok) {
          process.stdin.destroy();
          createApplicationAt(path);
        } else {
          abort('aborting');
        }
      });
    }
  });
})(path);

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplicationAt(path) {
  console.log();
  process.on('exit', function(){
    console.log();
    console.log('   install dependencies:');
    console.log('     $ cd %s && npm install', path);
    console.log();
    console.log('   run the app:');
    console.log('     $ node app');
    console.log();
  });

  mkdir(path, function(){
    mkdir(path + '/public');
    mkdir(path + '/public/javascripts');
    mkdir(path + '/public/images');
    mkdir(path + '/public/stylesheets', function(){
      switch (program.css) {
        case 'less':
          write(path + '/public/stylesheets/style.less', less);
          break;
        case 'stylus':
          write(path + '/public/stylesheets/style.styl', stylus);
          break;
        default:
          write(path + '/public/stylesheets/style.css', css);
      }
    });

    mkdir(path + '/routes', function(){
      write(path + '/routes/index.js', index);
      write(path + '/routes/user.js', users);
    });

    mkdir(path + '/views', function(){
      switch (program.template) {
        case 'ejs':
          write(path + '/views/index.ejs', ejsIndex);
          break;
        case 'jade':
          write(path + '/views/layout.jade', jadeLayout);
          write(path + '/views/index.jade', jadeIndex);
          break;
        case 'jshtml':
          write(path + '/views/layout.jshtml', jshtmlLayout);
          write(path + '/views/index.jshtml', jshtmlIndex);
          break;
        case 'hjs':
          write(path + '/views/index.hjs', hoganIndex);
          break;

      }
    });

    // CSS Engine support
    switch (program.css) {
      case 'less':
        app = app.replace('{css}', eol + '  app.use(require(\'less-middleware\')({ src: __dirname + \'/public\' }));');
        break;
      case 'stylus':
        app = app.replace('{css}', eol + '  app.use(require(\'stylus\').middleware(__dirname + \'/public\'));');
        break;
      default:
        app = app.replace('{css}', '');
    }

    // Session support
    app = app.replace('{sess}', program.sessions
      ? eol + '  app.use(express.cookieParser(\'your secret here\'));' + eol + '  app.use(express.session());'
      : '');

    // Template support
    app = app.replace(':TEMPLATE', program.template);

    // package.json
    var pkg = {
        name: 'application-name'
      , version: '0.0.1'
      , private: true
      , scripts: { start: 'node app' }
      , dependencies: {
        express: version
      }
    }

    if (program.template) pkg.dependencies[program.template] = '*';

    // CSS Engine support
    switch (program.css) {
      case 'less':
        pkg.dependencies['less-middleware'] = '*';
        break;
      default:
        if (program.css) {
          pkg.dependencies[program.css] = '*';
        }
    }

    write(path + '/package.json', JSON.stringify(pkg, null, 2));
    write(path + '/app.js', app);
  });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
  });
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */

function abort(str) {
  console.error(str);
  process.exit(1);
}

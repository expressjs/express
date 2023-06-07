'use strict'

/**
 * Module dependencies.
 */

var express = require('../../');
var ejs = require('ejs');
var hbs = require('hbs');
var path = require('path');
var fs = require('fs');

var viewsPath = path.join(__dirname, 'views');

/**
 * @description Helper function to render template string
 * from one template engine inside another one.
 *      Note:
 *          for demo purpose only one template engine (HBS)
 *          is added to the strategy, but you can add as many
 *          as you want to. Optimization on HBS can be applied
 *          via precompiling or on demand caching.
 *          further this helper method is passed to the view's
 *          scope so we can access it from anywhere.
 * @example
 *        EJS template
 *           - render(HBS template)
 */
function render(relativePath, options) {
  var absolutePath = path.join(viewsPath, relativePath);
  var engine = relativePath.split('.').pop();

  var strategy = {
    'hbs': function() {
      var str = fs.readFileSync(absolutePath, 'utf8');
      var template = hbs.handlebars.compile(str);
      return template(options);
    },
  }

  return (strategy[engine] && strategy[engine]())
    || '<!-- unsupported engine -->';
}

var app = express();

app.locals.render = render;

app.engine('html', ejs.renderFile);
app.engine('ejs', ejs.renderFile);
app.engine('hbs', hbs.__express);

app.set('view engine', 'html');
app.set('views', viewsPath)

/**
 * @description entrypoint for demo
 * default ejs template will include 1 EJS template and will
 * try to render 2 others, namely HBS and PUG. Since we
 * have not configured PUG in our strategy above, it will
 * output a comment.
 *    Input (psudo):
 *        EJS template
 *          - include EJS template
 *          - render HBS template
 *          - render PUG template
 *    Output:
 *        <div>template_1: EJS</div>
 *        <div> template_2: HBS, rendered inside EJS</div>
 *        <!-- unsupported engine -->
 */
app.get('/', function(_req, res) {
  res.render('index');
});

/**
 * @description simply rendering EJS template.
 */
app.get('/ejs', function(_req, res) {
  res.render('template_1.ejs');
})

/**
 * @description simply rendering HBS template.
 */
app.get('/hbs', function(_req, res) {
  res.render('template_2.hbs', { parentTemplateType: 'HBS' });
});

/**
 * @description will throw an error since we have not configured.
 * this template engine.
 */
app.get('/pug', function(_req, res) {
  res.render('template_3.pug', { parentTemplateType: 'PUG' });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

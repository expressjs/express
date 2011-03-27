/**
 * Module dependencies.
 */

var express = require('../../lib/express'),
    app = express.createServer(),
    ninja = {
      name: 'leonardo',
      summary: { email: 'hunter.loftis+github@gmail.com', master: 'splinter', description: 'peaceful leader' },
      weapons: ['katana', 'fists', 'shell'],
      victims: ['shredder', 'brain', 'beebop', 'rocksteady']
    };

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


// Some dynamic view helpers
app.dynamicHelpers({
  victims: function (req, res) {
    return function () {
      return app.renderer(res).partial('list', {collection: ninja.victims, as: 'element'});
    };
  },

  weapons: function (req, res) {
    return function () {
      return app.renderer(res).partial('list', {collection: ninja.weapons, as: 'element'});
    };
  }
});

app.get('/', function (req, res) {
  res.render('ninja', { ninja: ninja });
});

app.listen(3000);
console.log('Express app started on port 3000');

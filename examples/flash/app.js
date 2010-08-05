
/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// App with session support

var app = express.createServer(
    express.cookieDecoder(),
    express.session()
);

// View settings

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//

app.dynamicHelpers({
    messages: function(req, res){
        var types = req.flash(),
            keys = Object.keys(types),
            len = keys.length;
        if (len) {
            return '<div id="messages">' + keys.map(function(key){
                var msgs = types[key];
                return '<ul id="messages-' + key + '">' + msgs.map(function(msg){
                    return '<li>' + msg + '</li>';
                }).join('\n') + '</ul>';
            }).join('\n') + '</div>';
        } else {
            return '';
        }
    }
});

app.get('/', function(req, res){
    // Not very realistic notifications but illustrates usage
    req.flash('info', 'email queued');
    req.flash('info', 'email sent');
    req.flash('error', 'delivery failed');
    res.render('index');
});

app.listen(3000);
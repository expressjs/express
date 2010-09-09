
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

// Dynamic helpers are functions which are executed
// on each view render, unless dynamicHelpers is false.

// So for example we do not need to call messages() in our
// template, "messages" will be populated with the return
// value of this function.

app.dynamicHelpers({
    messages: function(req, res){
        // In the case of flash messages
        // we return a function, allowing
        // flash messages to only be flushed
        // when called, otherwise every request
        // will flush flash messages regardless.
        return function(){
            // Grab the flash messages
            var messages = req.flash();
            // We will render the "messages.ejs" partial
            return res.partial('messages', {
                // Our target object is our messages
                object: messages,
                // We want it to be named "types" in the partial
                // since they are keyed like this:
                // { info: ['foo'], error: ['bar']}
                as: 'types',
                // Pass a local named "hasMessages" so we can easily
                // check if we have any messages at all
                locals: { hasMessages: Object.keys(messages).length },
                // We dont want dynamicHelpers in this partial, as
                // it would cause infinite recursion
                dynamicHelpers: false
            });
        }
    }
});

app.dynamicHelpers({
    // Another dynamic helper example. Since dynamic
    // helpers resolve at view rendering time, we can
    // "inject" the "page" local variable per request
    // providing us with the request url.
    page: function(req, res){
        return req.url;
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
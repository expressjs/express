require.paths.unshift("./lib")
require('express')

get('hello/:value', function(req, res) {
    '<html><head><title>Traditional Example</title></head><body><h1>Hello '+param('value')+'</h1></body></html>'    
});

Express.start();

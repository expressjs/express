require.paths.unshift("./lib")
require('express')

get('hello/:value/:time', function() {
	setTimeout(function() {
		Express.server.finished('<html><head><title>Asynchronous Example</title></head><body><h1>Hello '+param('value')+', I waited '+param('time')+'ms to talk to you.</h1></body></html>')
	}, param('time'))
});

Express.start();

require.paths.unshift("./lib")
require('express')

use(Express.Logger)

get('/wait/:ms', function() {
	setTimeout(function() {
	  halt('Waited ' + param('ms') + ' milliseconds before replying')
	}, param('ms'))
});

Express.start()


// ok so it's not JSON, but close enough :)

var express = require('../../');

exports.development = {
    'view engine': 'jade'
  , 'views': __dirname + '/views'
  , 'title': 'My Site'
  , 'middleware': [
      express.logger('dev')
    , app.router
    , express.static(__dirname + '/public')
  ]
};

exports.production = {
  
};

var httpStatusCode = require('../lib/httpStatusCode').httpStatusCode
  , assert = require('assert');

describe('Http Status Code', function(){

  
  it('should be right http status code', function(){
    httpStatusCode.OK.should.eql(200);
    httpStatusCode.Created.should.eql(201);
    httpStatusCode.BadRequest.should.eql(400);
    httpStatusCode.InternalServerError.should.eql(500);
  })
})

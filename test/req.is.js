
var express = require('../')
  , request = require('supertest');

function req(ct) {
  var req = {
    headers: {
      'content-type': ct,
      'transfer-encoding': 'chunked'
    },
    __proto__: express.request
  };

  return req;
}

describe('req.is()', function(){
  it('should ignore charset', function(){
    req('application/json')
    .is('json')
    .should.equal('json');
  })

  describe('when content-type is not present', function(){
    it('should return false', function(){
      req('')
      .is('json')
      .should.be.false;
    })
  })

  describe('when given an extension', function(){
    it('should lookup the mime type', function(){
      req('application/json')
      .is('json')
      .should.equal('json');

      req('text/html')
      .is('json')
      .should.be.false;
    })
  })

  describe('when given a mime type', function(){
    it('should match', function(){
      req('application/json')
      .is('application/json')
      .should.equal('application/json');

      req('image/jpeg')
      .is('application/json')
      .should.be.false;
    })
  })

  describe('when given */subtype', function(){
    it('should match', function(){
      req('application/json')
      .is('*/json')
      .should.equal('application/json');

      req('image/jpeg')
      .is('*/json')
      .should.be.false;
    })

    describe('with a charset', function(){
      it('should match', function(){
        req('text/html; charset=utf-8')
        .is('*/html')
        .should.equal('text/html');

        req('text/plain; charset=utf-8')
        .is('*/html')
        .should.be.false;
      })
    })
  })

  describe('when given type/*', function(){
    it('should match', function(){
      req('image/png')
      .is('image/*')
      .should.equal('image/png');

      req('text/html')
      .is('image/*')
      .should.be.false;
    })

    describe('with a charset', function(){
      it('should match', function(){
        req('text/html; charset=utf-8')
        .is('text/*')
        .should.equal('text/html');

        req('something/html; charset=utf-8')
        .is('text/*')
        .should.be.false;
      })
    })
  })
})

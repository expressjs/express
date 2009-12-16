
describe 'Express'
  describe 'BodyDecoder'
    describe 'given "application/x-www-form-urlencoded"'
      it 'should parse body as urlencoded params'
        post('/login', function(){
          return this.param('name')
        })
        var response = post('/login', { body: 'name=tj', headers: { 'content-type': 'application/x-www-form-urlencoded' }})
        response.status.should.eql 200
        response.body.should.eql 'tj'
      end
      
      describe 'with charset'
        it 'should parse body as urlencoded params'
          post('/login', function(){
            return this.param('name')
          })
          var response = post('/login', { body: 'name=tj', headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }})
          response.status.should.eql 200
          response.body.should.eql 'tj'
        end
      end
    end
  end
end
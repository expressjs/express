
describe 'Express'
  before_each
    reset()
  end
  
  describe 'param()'
    it 'should return a route placeholder value'
      get('/user/:id', function(){
        return 'user ' + param('id')
      })
      get('/user/12').body.should.eql 'user 12'
    end
    
    it 'should return several route placeholder values'
      get('/user/:id/:operation', function(){
        return param('operation') + 'ing user ' + param('id') 
      })
      get('/user/12/edit').body.should.eql 'editing user 12'
    end
  end
end
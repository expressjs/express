
use({
  name : 'foo',
  init : function() {
    initCalled = true
  },
  
  settings : {
    one : 1,
    two : 2
  },
  
  utilities : {
    foo : function(){
      return 'bar'
    }
  },
  
  onFoo : {
    'return bar' : function(one, two) {
      return 'bar ' + one + ' ' + two
    }
  },
  
  onFooImmutable : {
    'test one' : function(immutable, arg) {
      return 'one ' + immutable
    },
    
    'test two' : function(immutable, arg) {
      return immutable + ' two'
    }
  }
})

describe 'Express'
  describe 'Modules'
    before_each
      Express.routes = []
    end
    
    it 'should call init when passed to use()'
      initCalled.should.be_true
    end
    
    it 'should merge utilities'
      Express.utilities.foo().should.eql 'bar'
    end
    
    it 'should expose utilities to routes'
      get('foo', function(){ foo() })
      get('foo').body.should.eql 'bar'
    end
    
    it 'should merge settings'
      Express.settings.foo.one.should.eql 1
      Express.settings.foo.two.should.eql 2
    end
    
    it 'should throw error when trying to merge settings without module name'
      -{ use({ settings : { foo : 'bar' }}) }.should.throw_error(/module name is required/)
    end
    
    describe 'hook()'
      it 'should call hook implementations returning an array of results'
        Express.hook('onFoo', 'test', 'stuff').should.eql ['bar test stuff']
      end
    end
    
    describe 'hookImmutable'
      it 'should call hook implementations sequencially passing the first argument passed'
        Express.hookImmutable('onFooImmutable', 'test').should.eql 'one test two'
      end
    end
  end
end

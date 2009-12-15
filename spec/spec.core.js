
describe 'Express'
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe 'set()'
    it 'should set an option'
      set('throw exceptions').should.be_null
      set('throw exceptions', true)
      set('throw exceptions').should.be_true
    end
    
    it 'should defer using a function'
      set('root', 'spec')
      set('views', function(){ return set('root') + '/views' })
      set('views').should.eql 'spec/views'
    end
  end
  
  describe 'enable()'
    it 'should enable an option'
      enable('sessions')
      set('sessions').should.be_true
    end
  end
  
  describe 'disable()'
    it 'should disable an option'
      disable('sessions')
      set('sessions').should.be_false
    end
  end
  
  describe 'configure()'
    describe 'given several calls'
      it 'should call them in sequence'
        var order = []
        configure(function(){
          order.push('a')
        })
        configure(function(){
          order.push('b')
        })
        configure('development')
        order.should.eql ['a', 'b']
      end
      
      it 'should call the specific environment only'
        var order = []
        configure('test', function(){
          order.push('a')
        })
        configure('development', function(){
          order.push('b')
        })
        configure('test', function(){
          order.push('c')
        })
        configure('test')
        order.should.eql ['a', 'c']
      end
      
      it 'should call global configurations as well'
        var order = []
        configure(function(){
          order.push('a')
        })
        configure('development', function(){
          order.push('b')
        })
        configure('test', function(){
          order.push('c')
        })
        configure(function(){
          order.push('d')
        })
        configure('test')
        order.should.eql ['a', 'c', 'd']
      end
    end
    
    describe 'given no arguments'
      it 'should throw an error'
        // TODO: tighter spec once JSpec is fixed
        -{ configure() }.should.throw_error
      end
    end
  end
  
end
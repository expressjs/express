
describe 'Express'
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe 'set()'
    it 'should set an option'
      set('raise exceptions').should.be_null
      set('raise exceptions', true)
      set('raise exceptions').should.be_true
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
    describe 'given a function'
      it 'should be called for any environment'
        var called = false
        configure(function(){
          called = true
        })
        configure('development')
        called.should.be_true
      end
    end
    
    describe 'given several calls functions'
      it 'should call them in sequence'
        var order = []
        configure(function(){
          called.push('a')
        })
        configure(function(){
          called.push('b')
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

  end
end
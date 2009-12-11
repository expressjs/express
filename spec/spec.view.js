
describe 'Express'
  before_each
    reset()
  end
  
  describe 'set("views")'
    it 'should default to <root>/views'
      set('root', 'spec')
      set('views').should.eql 'spec/views'
    end
  end

  describe 'render()'
    
  end
end
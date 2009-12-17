
describe 'Express'
  before_each
    reset()
  end
  
  describe 'View'
    describe 'set("views")'
      it 'should default to <root>/views'
        set('root', 'spec')
        set('views').should.eql 'spec/views'
      end
    end
  end
end
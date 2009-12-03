
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
end

describe 'Express'
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match /\d+\.\d+\.\d+/
    end
  end
end
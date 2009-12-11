
process.mixin(require('express/collection'))
process.mixin(require('express/element-collection'))

describe 'Express'
  describe 'ElementCollection'
  
    describe '$("markup string")'
      it 'should return a ElementCollection'
        $('<p>foo</p>').should.be_an_instance_of Collection
        $('<p>foo</p>').should.be_an_instance_of ElementCollection
      end
    end
    
    describe '#at()'
      it 'should return the first element'
        $('<p>foo</p>').at(0).name().should.eql 'body'
        $('<p>foo</p>').at(0).children()[0].name().should.eql 'p'
      end
    end
    
    describe '#toString()'
      it 'should output [ElementCollection ...]'
        $('<p>foo</p>').toString().should.match(/\[ElementCollection/)
      end
    end
    
  end
end
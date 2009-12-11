
process.mixin(require('express/collection'))
process.mixin(require('express/element-collection'))

describe 'Express'
  describe 'ElementCollection'
  
    describe '$("markup string")'
      it 'should return a ElementCollection'
        $('<p>foo</p>').should.be_an_instance_of Collection
        $('<p>foo</p>').should.be_an_instance_of ElementCollection
      end
      
      it 'should wrap with <html><body>.. when not present'
        $('<p>foo</p>').at(0).name().should.eql 'html'
      end
      
      it 'should not wrap with <html><body> when already present'
        $('<html><body></body></html>').at(0).name().should.eql 'html'
      end
    end
    
    describe '#name()'
      it 'should return the first elements name'
        $('<html><body></body></html>').name().should.eql 'html'
      end
    end
    
    describe '#xpath()'
      it 'should find children matching the given xpath'
        $('<li>1</li><li>2</li>').xpath('descendant-or-self::li').length().should.eql 2
        $('<li>1</li><li>2</li>').xpath('descendant-or-self::li').at(0).name().should.eql 'li'
        var items = $('<li><p>Foo</p></li><li><p>Bar</p></li>').xpath('descendant-or-self::li')
        items.xpath('descendant-or-self::p').length().should.eql 2
      end
    end
    
  end
end
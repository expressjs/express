
process.mixin(require('express/collection'))

describe 'Express'
  describe 'collection'
    describe '$(array)'
      it 'should return a Collection'
        $(['foo', 'bar']).should.be_an_instance_of Collection
      end
      
      it 'should have length'
        $(['foo', 'bar']).length.should.eql 2
      end
      
      it 'should have indexed values'
        $(['foo', 'bar'])[0].should.eql 'foo'
        $(['foo', 'bar'])[1].should.eql 'bar'
      end
    end
    
    describe '$(Collection)'
      it 'should return the collection passed'
        var collection = $(['foo'])
        $(collection).should.equal collection
      end
    end
  end
end
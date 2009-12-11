
process.mixin(require('express/collection'))
require('support/libxmljs')

describe 'Express'
  describe 'Collection'
  
    describe '$(array)'
      it 'should return a Collection'
        $(['foo', 'bar']).should.be_an_instance_of Collection
      end
    end
    
  end
end
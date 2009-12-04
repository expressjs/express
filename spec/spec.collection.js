
process.mixin(require('express/collection'))

describe 'Express'
  describe 'Collection'
    describe '$(array)'
      it 'should return a Collection'
        $(['foo', 'bar']).should.be_an_instance_of Collection
      end
    end
    
    describe '$(object)'
      it 'should return a Collection'
        $({ foo: 'bar' }).should.be_an_instance_of Collection
      end
    end
    
    describe '$(Collection)'
      it 'should return the collection passed'
        var collection = $(['foo'])
        $(collection).should.equal collection
      end
    end
    
    describe '#at()'
      it 'should return the value at the given index'
        $(['foo', 'bar']).at(0).should.eql 'foo'
        $(['foo', 'bar']).at(1).should.eql 'bar'
        $(['foo', 'bar']).at(2).should.be_null
      end
      
      it 'should work with objects'
        $({ foo: 'bar', baz: 'raz' }).at(0).should.eql 'bar'
        $({ foo: 'bar', baz: 'raz' }).at(1).should.eql 'raz'
        $({ foo: 'bar', baz: 'raz' }).at(2).should.be_null
      end
    end
    
    describe '#each()'
      it 'should iterate passing index and value'
        var result = []
        $(['foo', 'bar']).each(function(val, i){
          result.push(i, val)
        })
        result.should.eql [0, 'foo', 1, 'bar']
      end
      
      it 'should work with objects'
        var result = []
        $({ foo: 'bar', baz: 'raz' }).each(function(val, key){
          result.push(key, val)
        })
        result.should.eql ['foo', 'bar', 'baz', 'raz']
      end
      
      it 'should return the collection'
        $([]).each(function(){}).should.be_an_instance_of Collection
      end
    end
    
    describe '#map()'
      it 'should iterate collecting results into a new collection'
        var collection = $(['foo', 'bar']).map(function(val){ return val.toUpperCase() })
        collection.at(0).should.eql 'FOO'
        collection.at(1).should.eql 'BAR'
      end
      
      it 'should work with objects'
        var collection = $({ foo: 'bar', baz: 'raz' }).map(function(val){ return val.toUpperCase() })
        collection.at(0).should.eql 'BAR'
        collection.at(1).should.eql 'RAZ'
      end
    end
  end
end
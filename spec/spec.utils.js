
describe 'Express'
  before
    utils = require('express/utils')
  end
  
  describe 'escape()'
    it 'should escape html'
      utils.escape('<p>this & that').should.eql '&lt;p&gt;this &amp; that'
    end
  end
  
  describe 'uid()'
    it 'should return a string of random characters'
      utils.uid().should.not.eql utils.uid()
      utils.uid().length.should.be_greater_than 20
    end
  end
  
  describe 'mergeParam()'
    describe 'with empty params'
      it 'should merge the given key and value'
        params = {}
        utils.mergeParam('user[names][firstName]', 'tj', params)
        params.user.names.firstName.should.eql 'tj'
      end
    end
    
    describe 'with populated params'
      it 'should merge not overwrite'
        params = { user: { name: 'tj' }}
        utils.mergeParam('user[email]', 'tj@vision-media.ca', params)
        params.user.name.should.eql 'tj'
        params.user.email.should.eql 'tj@vision-media.ca'
      end
    end
    
    describe 'with an object as value'
      it 'should preserve it'
        params = {}
        utils.mergeParam('images[]', { name: 1 }, params)
        utils.mergeParam('images[]', { name: 2 }, params)
        params.images.should.eql [{ name: 1}, { name: 2 }]
      end
    end
    
    describe 'key[number]'
      it 'should merge correctly'
        params = { images: { one: 'foo.png' }}
        utils.mergeParam('images[0]', 'bar.png', params)
        params.images.one.should.eql 'foo.png'
        params.images[0].should.eql 'bar.png'
      end
    end
    
    describe 'key[]'
      describe 'with a single value'
        it 'should still be an array'
          params = {}
          utils.mergeParam('images[]', '1', params)
          params.images.should.eql ['1']
        end
      end
    
      describe 'with empty params'
        it 'should merge correctly'
          params = {}
          utils.mergeParam('images[]', '1', params)
          utils.mergeParam('images[]', '2', params)
          params.images.should.eql ['1', '2']
        end
      end
      
      describe 'with populated params'
        it 'should convert to an array'
          params = { images: 'foo.png'}
          utils.mergeParam('images[]', '1', params)
          params.images.should.eql ['foo.png', '1']
        end
      end
      
      describe 'with several merges'
        it 'should push values'
          params = {}
          utils.mergeParam('images[]', '1', params)
          utils.mergeParam('images[]', '2', params)
          utils.mergeParam('images[]', '3', params)
          params.images.should.eql ['1', '2', '3']
        end
      end
      
      describe 'when nested'
        it 'should marge correctly'
          params = {}
          utils.mergeParam('user[tj][images][]', '1', params)
          utils.mergeParam('user[tj][images][]', '2', params)
          utils.mergeParam('user[tj][images][]', '3', params)
          params.user.should.eql { tj: { images: ['1', '2', '3'] }}
        end
      end
    end
    
  end
end
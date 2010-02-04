
describe 'Express'
  before
    utils = require('express/utils')
  end
  
  describe 'toArray()'
    describe 'when given an array'
      it 'should return the array'
        utils.toArray([1,2,3]).should.eql [1,2,3]
      end
    end
    
    describe 'when given an object with indexed values and length'
      it 'should return an array'
        var args = -{ return arguments }('foo', 'bar')
        utils.toArray(args).should.eql ['foo', 'bar']
      end
    end
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
  
  describe 'extname()'
    it 'should return the a files extension'
      utils.extname('image.png').should.eql 'png'
      utils.extname('image.large.png').should.eql 'png'
      utils.extname('/path/to/image.large.png').should.eql 'png'
    end
    
    it 'should return null when not found'
      utils.extname('path').should.be_null
      utils.extname('/just/a/path').should.be_null
    end
  end
  
  describe 'basename()'
    it 'should return a files basename'
      utils.basename('foo/bar/baz.image.png').should.eql 'baz.image.png'
    end
  end
  
  describe 'mergeParam()'
    describe 'with empty params'
      it 'should merge the given key and value'
        params = {}
        utils.mergeParam('user[names][first]', 'tj', params)
        params.user.names.first.should.eql 'tj'
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
    
    describe 'key[number]'
      it 'should work'
        params = { images: { one: 'foo.png' }}
        utils.mergeParam('images[0]', 'bar.png', params)
        params.images.one.should.eql 'foo.png'
        params.images[0].should.eql 'bar.png'
      end
    end
    
  end
end
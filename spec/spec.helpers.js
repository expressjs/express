
describe 'Express'
  describe 'parseParams()'
    it 'should parse simple query string key / value pairs'
      parseParams('foo=bar').should.eql { foo: 'bar' }
      parseParams('foo=bar&baz=1').should.eql { foo: 'bar', baz: '1' }
    end
    
    it 'should parse named nested params'
      var user = { user: { name: 'tj', email: 'tj@vision-media.ca' }}
      parseParams('user[name]=tj&user[email]=tj@vision-media.ca').should.eql user
    end
    
    it 'should parse several levels of nesting'
      var user = { user: { name: 'tj', email: { primary: 'tj@vision-media.ca' }}}
      parseParams('user[name]=tj&user[email][primary]=tj@vision-media.ca').should.eql user
    end
    
    it 'should convert + to literal space'
      parseParams('foo=bar+baz++that').should.eql { foo: 'bar baz  that' }
      parseParams('user[name]=tj+holowaychuk').should.eql { user: { name: 'tj holowaychuk' }}
    end
    
    it 'should decode hex literals'
      parseParams('foo=bar%20baz%20%20that').should.eql { foo: 'bar baz  that' }
      parseParams('user[name]=tj%20holowaychuk').should.eql { user: { name: 'tj holowaychuk' }}
    end
  end
  
  describe 'toArray()'
    describe 'when given an array'
      it 'should return the array'
        toArray([1,2,3]).should.eql [1,2,3]
      end
    end
    
    describe 'when given an object with indexed values and length'
      it 'should return an array'
        var args = -{ return arguments }('foo', 'bar')
        toArray(args).should.eql ['foo', 'bar']
      end
    end
  end
  
  describe 'escape()'
    it 'should escape html'
      escape('<p>this & that').should.eql '&lt;p&gt;this &amp; that'
    end
  end
  
  describe 'extname()'
    it 'should return the a files extension'
      extname('image.png').should.eql 'png'
      extname('image.large.png').should.eql 'png'
      extname('/path/to/image.large.png').should.eql 'png'
    end
    
    it 'should return null when not found'
      extname('path').should.be_null
      extname('/just/a/path').should.be_null
    end
  end
  
  describe 'dirname()'
    it 'should return the directory path'
      dirname('/path/to/images/foo.bar.png').should.eql '/path/to/images'
    end
  end
end
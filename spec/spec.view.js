
describe 'Express'
  before_each
    reset()
    set('views', dirname(__filename) + '/fixtures')
    user = {
      name: 'TJ',
      email: 'tj@vision-media.ca'
    }
  end

  describe 'render()'
    describe 'given *.ejs'
      it 'should render an ejs view'
        get('/user', function(){
          render('user.html.ejs', { context: user }, function(content){
            halt(200, content)
          })
        })
        p(get('/user').body)
      end
    end
    
    describe 'given *.*'
      it 'should render the contents'
        
      end
    end
    
    describe 'given a file which does not exist'
      it 'should throw ViewNotFound'
        
      end
    end
  end
end
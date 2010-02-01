
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
  end
  
  describe 'Session'
    it 'should description'
      
    end
  end
end
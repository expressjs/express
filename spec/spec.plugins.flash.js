
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
    use(require('express/plugins/flash').Flash)
    Session.store.clear()
  end
  
  describe 'Flash'
    
  end
end
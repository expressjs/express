
describe 'Express'
  describe '.build()'
    it 'should provide a markup DSL'
      markup = Express.build(
        form : { id : 'user-login'
          fieldset : { 'class' : 'fieldset'
            legend : { content : 'User Login' }
            input : { type : 'text', name : 'user[name]' }
            input : { type : 'password', name : 'user[password]' }
            input : { type : 'submit', name : 'op', value : 'Login' }
          }
        }
      })
    end
  end
end
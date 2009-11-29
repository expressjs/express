
describe 'Express'
  describe 'server'
    before_each
      Express.routes = []
    end

	describe 'callback'
			
		it 'should wait for an asynchronous handler to finish'
			require('jspec.timers')
			get('pants', function() {
				setTimeout(function() {
					Express.server.finished('asynchronous thing done')
				}, 50)
			})
			var response = get('pants')
			response.body.should.be_null

			tick(50)
			response.body.should.eql 'asynchronous thing done'
			response.status.should.eql 200
			response.headers['content-type'].should.eql 'text/html'
		end
			
		it 'should still accept a synchronous handler that returns a string'
			get('pants', function() { 'no pants' })
			get('pants').body.should.eql 'no pants'
		end
	end
  end
end


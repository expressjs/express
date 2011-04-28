
# Run $ expresso

#
# Module dependencies.
#

app = require '../app'
assert = require 'assert'

module.exports =
	'GET /': () ->
		assert.response app,
		{ url: '/' },
		{ status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
		(res) ->
			assert.includes res.body, '<title>Express</title>'
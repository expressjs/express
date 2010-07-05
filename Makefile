
test:
	@CONNECT_ENV=test ./support/expresso/bin/expresso -I lib test/*.test.js

.PHONY: test
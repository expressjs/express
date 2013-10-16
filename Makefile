
MOCHA_OPTS= --check-leaks
REPORTER = dot

check: test

test: test-unit test-acceptance

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--globals setImmediate,clearImmediate \
		$(MOCHA_OPTS)

test-acceptance:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail \
		test/acceptance/*.js

test-cov: lib-cov
	@EXPRESS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

benchmark:
	@./support/bench

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit test-acceptance benchmark clean

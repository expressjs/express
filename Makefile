
MOCHA_OPTS=
REPORTER = dot

docs: docs/express.md

docs/express.md: docs/application.md docs/request.md docs/response.md
	cat $^ > $@

docs/%.md: lib/%.js
	@mkdir -p docs
	dox --raw < $< | ./support/docs > $@

check: test

test: test-unit test-acceptance

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
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

docclean:
	rm -fr docs

benchmark:
	@./support/bench

.PHONY: docs docclean test test-unit test-acceptance benchmark

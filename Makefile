
REPORTER = dot

docs: docs/application.md docs/request.md docs/response.md

docs/%.md: lib/%.js
	@mkdir -p docs
	dox --raw < $< | ./support/docs > $@

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

test-acceptance:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		test/acceptance/*.js

test-cov: lib-cov
	@EXPRESS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

docclean:
	rm -fr docs

.PHONY: docs docclean site test test-acceptance

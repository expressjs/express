
DOCS = docs/*.md
HTMLDOCS = $(DOCS:.md=.html)
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

test-acceptance:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		test/acceptance/*.js

docs: $(HTMLDOCS)
	@ echo "... generating TOC"
	@./support/toc.js docs/guide.html

%.html: %.md
	@echo "... $< -> $@"
	@markdown $< \
	  | cat docs/layout/head.html - docs/layout/foot.html \
	  > $@

site:
	rm -fr /tmp/docs \
	  && cp -fr docs /tmp/docs \
	  && git checkout gh-pages \
  	&& cp -fr /tmp/docs/* . \
		&& echo "done"

benchmark:
	@./support/bench

docclean:
	rm -f docs/*.{1,html}

.PHONY: site test benchmark docs docclean test-acceptance

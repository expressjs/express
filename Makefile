
DOCS = $(shell find docs/*.md)
HTMLDOCS =$(DOCS:.md=.html)
TESTS = $(shell find test/*.test.js)

test:
	@NODE_ENV=test ./node_modules/.bin/expresso \
		-I lib \
		$(TESTFLAGS) \
		$(TESTS)

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

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

docclean:
	rm -f docs/*.{1,html}

.PHONY: site test test-cov docs docclean
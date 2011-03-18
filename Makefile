
DOCS = $(shell find docs/*.md)
HTMLDOCS =$(DOCS:.md=.html)

test:
	@NODE_ENV=test ./support/expresso/bin/expresso \
		-I lib \
		-I support \
		-I support/connect/lib \
		-I support/haml/lib \
		-I support/jade/lib \
		-I support/ejs/lib \
		$(TESTFLAGS) \
		test/*.test.js

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
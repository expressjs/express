
DOCS = docs/index.md \
	   docs/screencasts.md \
	   docs/executable.md \
	   docs/contrib.md \
	   docs/guide.md \
	   docs/migrate.md \
	   docs/applications.md

MANPAGES =$(DOCS:.md=.1)
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

docs: docs/api.html $(MANPAGES) $(HTMLDOCS)
	@ echo "... generating TOC"
	@./support/toc.js docs/guide.html

docs/api.html: lib/express/*.js
	dox \
		--private \
		--title Express \
		--desc "High performance web framework for [node](http://nodejs.org)." \
		$(shell find lib/express/* -type f) > $@

%.1: %.md
	@echo "... $< -> $@"
	@ronn -r --pipe $< > $@

%.html: %.md
	@echo "... $< -> $@"
	@ronn -5 --pipe --fragment $< \
	  | cat docs/layout/head.html - docs/layout/foot.html \
	  | sed 's/NAME/Express/g' \
	  > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test test-cov docs docclean
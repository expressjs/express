
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

docs: $(MANPAGES) $(HTMLDOCS)
	@ echo "... generating TOC"
	@./support/toc.js docs/guide.html

%.1: %.md
	@echo "... $< -> $@"
	@ronn -r --pipe $< > $@

%.html: %.md
	@echo "... $< -> $@"
	@ronn -5 --pipe --fragment $< \
	  | cat docs/layout/head.html - docs/layout/foot.html \
	  | sed 's/NAME/Express/g' \
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

PREFIX = /usr/local
LIB_PREFIX = ~/.node_libraries

DOCS = docs/index.md \
	   docs/executable.md \
	   docs/migrate.md

MANPAGES =$(DOCS:.md=.1)
HTMLDOCS =$(DOCS:.md=.html)

install:
	@mkdir -p $(PREFIX)/bin
	cp -f bin/express $(PREFIX)/bin/express
	cp -fr lib/express $(LIB_PREFIX)/express

uninstall:
	rm -f $(PREFIX)/bin/express
	rm -fr $(LIB_PREFIX)/express

test:
	@CONNECT_ENV=test ./support/expresso/bin/expresso \
		-I lib \
		-I support/connect/lib \
		-I support/jade/lib \
		test/*.test.js

docs: docs/api.html $(MANPAGES) $(HTMLDOCS)

docs/api.html: lib/express/*.js
	dox --title Express \
		--desc "High performance web framework for [node](http://nodejs.org)." \
		$(shell find lib/express/* -type f) > $@

%.1: %.md
	@echo "... $< -> $@"
	@ronn -r --pipe $< > $@ &

%.html: %.md
	@echo "... $< -> $@"
	@ronn -5 --pipe --fragment $< \
	  | cat docs/layout/head.html - docs/layout/foot.html \
	  | sed 's/NAME/Express/g' \
	  > $@ &

docclean:
	rm -f docs/*.{1,html}

.PHONY: install uninstall install-docs install-suppport test docs docclean
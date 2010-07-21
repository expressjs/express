
PREFIX = /usr/local
LIB_PREFIX = ~/.node_libraries

DOCS = docs/index.md \
	   docs/executable.md \
	   docs/contrib.md \
	   docs/guide.md \
	   docs/migrate.md

MANPAGES =$(DOCS:.md=.1)
HTMLDOCS =$(DOCS:.md=.html)

install: install-docs
	@mkdir -p $(PREFIX)/bin
	cp -f bin/express $(PREFIX)/bin/express
	cp -fr lib/express $(LIB_PREFIX)/express

uninstall: uninstall-docs
	rm -f $(PREFIX)/bin/express
	rm -fr $(LIB_PREFIX)/express

install-support:
	cd support/connect && $(MAKE) install
	cd support/jade && $(MAKE) install

uninstall-support:
	cd support/connect && $(MAKE) uninstall
	cd support/jade && $(MAKE) uninstall

install-docs:
	cp -f docs/executable.1 $(PREFIX)/share/man/man1/express.1

uninstall-docs:
	rm -f $(PREFIX)/share/man/man1/express.1

test:
	@CONNECT_ENV=test ./support/expresso/bin/expresso \
		--growl \
		-I lib \
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
	dox --title Express \
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

.PHONY: install uninstall install-docs install-support uninstall-support install-docs uninstall-docs test test-cov docs docclean
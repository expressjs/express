
DOCS = docs/index.md \
	   docs/executable.md \
	   docs/migrate.md

MANPAGES =$(DOCS:.md=.1)
HTMLDOCS =$(DOCS:.md=.html)

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

.PHONY: test docs docclean
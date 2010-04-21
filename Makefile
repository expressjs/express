
NODE = node
COFFEE = coffee
PREFIX = /usr/local

all: test
	
install: bin/express
	ln -fs $< $(PREFIX)/bin/express

uninstall: 
	rm -f $(PREFIX)/bin/express

test:
	@$(NODE) spec/node.js all
	
app: app-chat
	
prof:
	@$(NODE) --prof --prof_auto examples/chat/app.js
	
app-chat:
	@$(NODE) examples/chat/app.js

app-upload:
	@$(NODE) examples/upload/app.js
	
app-coffee-upload: compile-coffee
	@$(NODE) examples/coffee-upload/app.js
	
compile-coffee:
	@$(COFFEE) examples/coffee-upload/app.coffee
	
.PHONY: install test app
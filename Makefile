
NODE = node
COFFEE = coffee

all: test
	
install: bin/express
	install bin/express /usr/local/bin/express

test:
	@$(NODE) spec/node.js all
	
app: app-chat
	
app-chat:
	@$(NODE) examples/chat/app.js
	
app-upload:
	@$(NODE) examples/upload/app.js
	
app-coffee-upload: compile-coffee
	@$(NODE) examples/coffee-upload/app.js
	
compile-coffee:
	@$(COFFEE) examples/coffee-upload/app.coffee
	
.PHONY: install test app
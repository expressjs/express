
NODE = node

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
	
.PHONY: install test app
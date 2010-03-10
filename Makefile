
NODE = node

all: test

init:
	@git submodule init && git submodule update

test:
	@$(NODE) spec/node.js all
	
app: app-chat
	
app-chat:
	@$(NODE) examples/chat/app.js
	
app-upload:
	@$(NODE) examples/upload/app.js
	
.PHONY: init test app
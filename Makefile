		
AB = ab
ABFLAGS = -n 3000 -c 50
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

app-hello-world:
	@$(NODE) examples/hello-world/app.js

app-upload:
	@$(NODE) examples/upload/app.js
	
app-coffee-upload: compile-coffee
	@$(NODE) examples/coffee-upload/app.js
	
compile-coffee:
	@$(COFFEE) examples/coffee-upload/app.coffee

benchmark: benchmarks/run
	@./benchmarks/run
	@./benchmarks/graph

graphs:
	@./benchmarks/graph

.PHONY: install test app benchmark graphs
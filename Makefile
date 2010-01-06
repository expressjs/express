
NODE = node

init: lib/support/js-oo/Readme.md
	@git submodule update --init

test: init spec/support/libxmljs/libxmljs.node
	@$(NODE) spec/node.js
	
app:
	@$(NODE) examples/app.js
	
benchmark:
	@$(NODE) benchmarks/collection.js
	
spec/support/libxmljs/libxmljs.node:
	@scons -C spec/support/libxmljs libxmljs.node
	
.PHONY: init test benchmark app
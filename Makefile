
NODE = node

test: spec/support/libxmljs/libxmljs.node
	@$(NODE) spec/spec.node.js
	
app:
	@$(NODE) examples/app.js
	
benchmark:
	@$(NODE) benchmarks/collection.js
	
spec/support/libxmljs/libxmljs.node:
	@scons -C spec/support/libxmljs libxmljs.node
	
.PHONY: test benchmark app
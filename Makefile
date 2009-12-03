
NODE = node

test:
	@$(NODE) spec/spec.node.js
	
app:
	@$(NODE) examples/app.js
	
.PHONY: test
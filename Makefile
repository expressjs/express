
NODE = node

test:
	@$(NODE) spec/spec.node.js
	
app:
	@$(NODE) examples/app.js
	
benchmark:
	@$(NODE) benchmarks/collection.js
	
.PHONY: test benchmark app
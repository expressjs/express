
NODE = node

test:
	@$(NODE) spec/spec.node.js
	
.PHONY: test
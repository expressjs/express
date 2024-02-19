# Get the current ISO8601 date time format but remove + and :
$(shell date -I'minutes'| cut -d+ -f1 | sed 's/:/-/'> ./current)

CURRENT_NODE_VERSION := $(shell node -v)

# Create directory for current node version if it doesn't exist
$(shell mkdir -p ./results/${CURRENT_NODE_VERSION})

OUT_PATH := ./results/${CURRENT_NODE_VERSION}/$(shell cat ./current)

# Write git username to top of output file
$(shell git config --get-all credential.username > $(OUT_PATH))

# Write CPU model to top of output file
# Potentially split the results by CPU instead?
$(shell lscpu | grep 'Model name' | cut -d: -f2 | sed 's/\s*//' | sed 's/\s//g' | sed 's/\([^a-zA-Z0-9]\)/_/g' >> $(OUT_PATH))

all:
	@echo | tee -a $(OUT_PATH)
	@./run 1 middleware 50 "$(OUT_PATH)"
	@./run 5 middleware 50 "$(OUT_PATH)"
	@./run 10 middleware 50 "$(OUT_PATH)"
	@./run 15 middleware 50 "$(OUT_PATH)"
	@./run 20 middleware 50 "$(OUT_PATH)"
	@./run 30 middleware 50 "$(OUT_PATH)"
	@./run 50 middleware 50 "$(OUT_PATH)"
	@./run 100 middleware 50 "$(OUT_PATH)"
	@./run 10 middleware 100 "$(OUT_PATH)"
	@./run 10 middleware 250 "$(OUT_PATH)"
	@./run 10 middleware 500 "$(OUT_PATH)"
	@./run 10 middleware 1000 "$(OUT_PATH)"
	$(shell rm ./current)

.PHONY: all

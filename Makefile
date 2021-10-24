## https://www.thapaliya.com/en/writings/well-documented-makefiles/

.DEFAULT_GOAL:=help
SHELL:=/bin/bash

BUILD_VERSION ?= dev
DOCKER_REGISTRY ?= harbor.linecorp.com
DOCKER_REPOSITORY := $(DOCKER_REGISTRY)/abc-studio/user-feedback

##@ Helpers
.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

##@ Building
.PHONY: build-docker
build-docker: ##  Build the project
	$(info Building project)
	docker build \
	--build-arg BUILD_VERSION=$(BUILD_VERSION) \
	-t $(DOCKER_REPOSITORY):$(BUILD_VERSION) \
	-t $(DOCKER_REPOSITORY):latest \
	.

##@ Publish
.PHONY: publish-docker
publish-docker: ## Push docker image
	$(info Push docker image)
	docker push $(DOCKER_REPOSITORY):$(BUILD_VERSION)
	docker push $(DOCKER_REPOSITORY):latest

##@ Running
.PHONY: migrate
migrate: ## Run all database migrations
	$(info Run migration)

##@ Miscellaneous
.PHONY: clean
clean: ## Cleanup the project folders
	$(info Cleanup dist, build)
	rm -rf ./dist
	rm -rf ./.next

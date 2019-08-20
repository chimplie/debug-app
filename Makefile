.PHONY: all
.PHONY: docker-login

DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

$(shell env > /tmp/make-debug-app)
include .env
export $(shell sed 's/=.*//' .env)
include /tmp/make-debug-app
export $(shell sed 's/=.*//' /tmp/make-debug-app)

DOCKER_REGISTRY ?= ""
IMAGE_NAME ?= debug-app
DOCKER_TAG ?= local

info:
	@echo DOCKER_REGISTRY=$(DOCKER_REGISTRY) && \
	echo DOCKER_TAG=$(DOCKER_TAG)

clean: docker-down

docker-down:
	docker-compose -f $(DIR)/docker/docker-compose.yml down && \
	docker-compose -f $(DIR)/docker/docker-compose.yml rm -fsv

build:
	docker build --file $(DIR)/Dockerfile --tag $(IMAGE_NAME):ci-local $(DIR)

docker-login:
	@`aws ecr get-login --no-include-email`

tag:
	docker tag $(IMAGE_NAME):ci-local $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(DOCKER_TAG) && \
	docker tag $(IMAGE_NAME):ci-local $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest

push: docker-login
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(DOCKER_TAG) && \
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest

release: build tag push

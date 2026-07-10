BIN := bin/server
LDFLAGS := -s -w
STATIC := ../client/dist
LINT_VERSION := v2.12.2

.PHONY: build run lint test install-linter

build:
	go build -ldflags "$(LDFLAGS)" -o $(BIN) .

run: build
	./$(BIN) -static=$(STATIC)

install-linter:
	go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@$(LINT_VERSION)

lint:
	golangci-lint run ./...

test:
	go test ./...

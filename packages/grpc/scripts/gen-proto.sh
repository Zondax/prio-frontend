#!/bin/bash

# Get the project root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

echo "ROOT_DIR: $ROOT_DIR"

# Define absolute paths
PROTO_DIR="$ROOT_DIR/packages/prio-api/proto"
OUTPUT_DIR="$ROOT_DIR/ts/grpc/src/entities"

########################################

# Define color codes and formatting
BOLD="\033[1m"
RESET="\033[0m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
MAGENTA="\033[0;35m"
GRAY="\033[0;90m"

# Helper functions for logging
log_info() {
  echo -e "${BLUE}ℹ️${RESET}  $1"
}

log_success() {
  echo -e "${GREEN}✅${RESET} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠️  WARNING${RESET}: $1"
}

log_error() {
  echo -e "${RED}❌ ERROR${RESET}: $1"
}

log_step() {
  echo -e "\n${MAGENTA}🔄${RESET} ${BOLD}$1${RESET}"
}

log_cmd() {
  echo -e "${GRAY}$ $1${RESET}"
}

print_separator() {
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

log_step "Checking for proto files"
log_info "Looking in ${CYAN}$PROTO_DIR/api/v1${RESET}"

# Verify that the proto directory exists and has files
if [ ! -d "$PROTO_DIR/api/v1" ] || [ -z "$(ls -A "$PROTO_DIR"/api/v1/*.proto 2>/dev/null)" ]; then
    log_error "No proto files found in $PROTO_DIR/api/v1"
    exit 1
fi

log_success "Proto files found"

# Create a temporary directory for protos
log_step "Creating temporary directory"
TMP_PROTO_DIR=$(mktemp -d)
log_success "Created temporary directory: ${CYAN}$TMP_PROTO_DIR${RESET}"

# Copy .proto files maintaining the structure expected by imports
log_step "Copying proto files"
log_cmd "mkdir -p \"$TMP_PROTO_DIR/proto/api/v1\""
mkdir -p "$TMP_PROTO_DIR/proto/api/v1"
log_cmd "cp \"$PROTO_DIR/api/v1/\"*.proto \"$TMP_PROTO_DIR/proto/api/v1/\""
cp "$PROTO_DIR/api/v1/"*.proto "$TMP_PROTO_DIR/proto/api/v1/"
log_success "Files copied successfully"

# Verify that protoc is installed
log_step "Checking dependencies"
if ! command -v protoc &> /dev/null; then
    log_error "protoc is not installed. Please install it first."
    echo -e "   ${YELLOW}macOS${RESET}: ${CYAN}brew install protobuf${RESET}"
    echo -e "   ${YELLOW}Linux${RESET}: ${CYAN}apt-get install protobuf-compiler${RESET}"
    exit 1
fi
log_success "protoc is installed"
log_success "protoc version: $(protoc --version)"

# Verify that the grpc-web plugin is installed
if ! command -v protoc-gen-grpc-web &> /dev/null; then
    log_warning "protoc-gen-grpc-web plugin not found. Installing..."
    log_cmd "npm install -g protoc-gen-grpc-web"
    npm install -g protoc-gen-grpc-web
    log_success "protoc-gen-grpc-web installed"
else
    log_success "protoc-gen-grpc-web is installed"
fi

log_step "Generating proto files"
log_info "From: ${CYAN}$TMP_PROTO_DIR${RESET}"
log_info "To:   ${CYAN}$OUTPUT_DIR${RESET}"

# Process API files only if we have proto files
PROTO_FILES=()
while IFS= read -r file; do
    PROTO_FILES+=("$file")
done < <(find "$TMP_PROTO_DIR/proto/api" -name "*.proto" 2>/dev/null)

if [ ${#PROTO_FILES[@]} -gt 0 ]; then
    log_info ""
    log_info "Processing API proto files..."
    mkdir -p "$OUTPUT_DIR"
    
    log_cmd "protoc -I=\"$TMP_PROTO_DIR\" --js_out=import_style=commonjs,binary:\"$OUTPUT_DIR\" --grpc-web_out=import_style=typescript,mode=grpcwebtext:\"$OUTPUT_DIR\" ..."
    protoc \
        -I="$TMP_PROTO_DIR" \
        --js_out=import_style=commonjs,binary:"$OUTPUT_DIR" \
        --grpc-web_out=import_style=typescript,mode=grpcwebtext:"$OUTPUT_DIR" \
        "${PROTO_FILES[@]}"

    # Check for errors
    if [ $? -ne 0 ]; then
        log_warning "Errors occurred during proto generation"
        echo -e "   ${YELLOW}Please check:${RESET}"
        echo -e "   ${CYAN}1.${RESET} Files exist in: ${CYAN}$PROTO_DIR/api/v1/*.proto${RESET}"
        echo -e "   ${CYAN}2.${RESET} Import paths in .proto files use ${CYAN}'proto/api/v1/...'${RESET} format"
        rm -rf "$TMP_PROTO_DIR"
        exit 1
    fi
else
    log_error "No proto files found to process"
    rm -rf "$TMP_PROTO_DIR"
    exit 1
fi

# Clean up temporary directory
log_step "Cleaning up"
log_cmd "rm -rf \"$TMP_PROTO_DIR\""
rm -rf "$TMP_PROTO_DIR"
log_success "Temporary directory removed"

print_separator
log_success "Proto files generated successfully in ${CYAN}$OUTPUT_DIR${RESET} 🎉"
print_separator
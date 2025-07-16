#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load configuration from .vendor file
VENDOR_CONFIG=".vendor"

# Check if .vendor file exists
if [ ! -f "$VENDOR_CONFIG" ]; then
    log_error ".vendor configuration file not found"
    exit 1
fi

# Source the configuration
source "$VENDOR_CONFIG"

# Validate required variables
if [ -z "$REPO_URL" ] || [ -z "$GRPC_SOURCE_PATH" ] || [ -z "$GRPC_TARGET_PATH" ]; then
    log_error "Missing required configuration in .vendor file"
    log_error "Required: REPO_URL, GRPC_SOURCE_PATH, GRPC_TARGET_PATH"
    exit 1
fi

# Runtime configuration
BRANCH="${1:-main}"
TIMESTAMP=$(date +%s)
TMP_DIR="/tmp/prio-backend-${TIMESTAMP}"

# Cleanup function
cleanup() {
    if [ -d "$TMP_DIR" ]; then
        log_info "Cleaning up temporary directory: $TMP_DIR"
        rm -rf "$TMP_DIR"
    fi
}

# Set up cleanup on exit
trap cleanup EXIT

# Main script
main() {
    log_info "Starting vendor-grpc script"
    log_info "Branch: $BRANCH"
    log_info "Temporary directory: $TMP_DIR"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Clone the repository
    log_info "Cloning prio-backend repository..."
    if ! git clone "$REPO_URL" "$TMP_DIR"; then
        log_error "Failed to clone repository"
        exit 1
    fi
    
    # Change to the cloned directory
    cd "$TMP_DIR"
    
    # Checkout the specified branch
    log_info "Checking out branch: $BRANCH"
    if ! git checkout "$BRANCH"; then
        log_error "Failed to checkout branch: $BRANCH"
        exit 1
    fi
    
    # Check if grpc source directory exists
    if [ ! -d "$GRPC_SOURCE_PATH" ]; then
        log_error "Source directory $GRPC_SOURCE_PATH not found in prio-backend"
        exit 1
    fi
    
    # Return to original directory
    cd - > /dev/null
    
    # Remove existing grpc directory
    if [ -d "$GRPC_TARGET_PATH" ]; then
        log_info "Removing existing $GRPC_TARGET_PATH directory"
        rm -rf "$GRPC_TARGET_PATH"
    fi
    
    # Copy grpc directory
    log_info "Copying $GRPC_SOURCE_PATH to $GRPC_TARGET_PATH"
    if ! cp -r "$TMP_DIR/$GRPC_SOURCE_PATH" "$GRPC_TARGET_PATH"; then
        log_error "Failed to copy grpc directory"
        exit 1
    fi
    
    log_info "Successfully updated packages/grpc from prio-backend branch: $BRANCH"
    
    # Show summary
    if [ -f "$GRPC_TARGET_PATH/package.json" ]; then
        GRPC_VERSION=$(grep '"version"' "$GRPC_TARGET_PATH/package.json" | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
        log_info "Copied grpc package version: $GRPC_VERSION"
    fi
}

# Show usage if help is requested
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: $0 [branch-name]"
    echo ""
    echo "Clone repository from specified branch and copy grpc files"
    echo "Configuration is read from .vendor file in the project root"
    echo ""
    echo "Arguments:"
    echo "  branch-name    Branch to clone from (default: main)"
    echo ""
    echo "Configuration (.vendor file):"
    echo "  REPO_URL           Repository URL to clone from"
    echo "  GRPC_SOURCE_PATH   Source path within cloned repository"
    echo "  GRPC_TARGET_PATH   Target path in current project"
    echo ""
    echo "Examples:"
    echo "  $0                    # Clone from main branch"
    echo "  $0 main               # Clone from main branch"
    echo "  $0 feature/new-api    # Clone from feature branch"
    exit 0
fi

# Run main function
main "$@"
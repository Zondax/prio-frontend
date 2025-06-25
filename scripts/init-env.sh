#!/bin/bash

# init-env.sh - Download environment files from GCP Secret Manager
# Usage: ./scripts/init-env.sh <app-name>
# Example: ./scripts/init-env.sh web

# Only set -e if not being called from another script
[[ -z "$INIT_ALL_MODE" ]] && set -e

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly CONFIG_FILE="$PROJECT_ROOT/env-config.json"
# Valid apps will be read from config file

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }

# Validation functions
validate_args() {
    if [[ $# -eq 0 ]]; then
        log_error "App name is required"
        echo "Usage: $0 <app-name>"
        if [[ -f "$CONFIG_FILE" ]] && command -v jq &> /dev/null; then
            local available_apps
            available_apps=$(jq -r '.gcp.secrets | keys | join(" ")' "$CONFIG_FILE" 2>/dev/null)
            [[ -n "$available_apps" ]] && echo "Available apps: $available_apps"
        fi
        exit 1
    fi
}

validate_app_name() {
    local app_name="$1"
    local available_apps
    
    # Read available apps from config file
    if ! available_apps=$(jq -r '.gcp.secrets | keys[]' "$CONFIG_FILE" 2>/dev/null); then
        log_error "Failed to read available apps from config file"
        exit 1
    fi
    
    # Check if app exists in config
    if echo "$available_apps" | grep -q "^$app_name$"; then
        return 0
    fi
    
    log_error "Invalid app name: $app_name"
    echo "Available apps: $(echo "$available_apps" | tr '\n' ' ')"
    exit 1
}

validate_dependencies() {
    # Check config file
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration file not found: $CONFIG_FILE"
        log_info "Please create the configuration file with your GCP project settings"
        exit 1
    fi

    # Check jq
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed"
        echo "Install: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        exit 1
    fi

    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed"
        echo "Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi

    # Check gcloud auth
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q . 2>/dev/null; then
        log_error "Not authenticated with gcloud"
        echo "Run: gcloud auth login"
        exit 1
    fi
}

validate_config() {
    local project_id="$1"
    local secret_name="$2"
    
    if [[ "$project_id" == "YOUR_PROJECT_ID" || "$project_id" == "null" ]]; then
        log_error "GCP project ID not configured in $CONFIG_FILE"
        log_info "Please update the projectId in $CONFIG_FILE"
        exit 1
    fi

    if [[ "$secret_name" == "null" ]]; then
        log_error "Secret name not configured for app: $APP_NAME"
        exit 1
    fi
}

validate_target_dir() {
    local target_dir="$1"
    if [[ ! -d "$target_dir" ]]; then
        log_error "App directory does not exist: $target_dir"
        exit 1
    fi
}

# Core functions
read_config() {
    local app_name="$1"
    PROJECT_ID=$(jq -r '.gcp.projectId' "$CONFIG_FILE")
    SECRET_NAME=$(jq -r ".gcp.secrets.$app_name" "$CONFIG_FILE")
}

download_secret() {
    local project_id="$1"
    local secret_name="$2"
    local target_file="$3"
    
    log_info "Downloading environment file for $APP_NAME..."
    log_info "Project: $project_id"
    log_info "Secret: $secret_name"
    log_info "Target: $target_file"
    
    if gcloud secrets versions access latest --secret="$secret_name" --project="$project_id" > "$target_file" 2>/dev/null; then
        log_success "Environment file downloaded from GCP Secret Manager"
        return 0
    else
        log_error "Failed to download secret from GCP Secret Manager"
        log_info "Make sure:"
        echo "  - The secret '$secret_name' exists in your GCP project '$project_id'"
        echo "  - You have the necessary permissions to access it"
        echo "  - Your gcloud CLI is configured with the correct project"
        echo "  - You are authenticated with gcloud (run: gcloud auth login)"
        
        # Clean up empty file if created
        [[ -f "$target_file" && ! -s "$target_file" ]] && rm "$target_file"
        return 1
    fi
}

show_file_info() {
    local target_file="$1"
    
    if [[ -f "$target_file" && -s "$target_file" ]]; then
        local file_size line_count
        file_size=$(wc -c < "$target_file")
        line_count=$(wc -l < "$target_file")
        
        log_info "File saved to: $target_file"
        log_info "File size: ${file_size} bytes, Lines: ${line_count}"
        log_success "Environment initialization completed for $APP_NAME"
        return 0
    else
        log_error "Environment file is empty or was not created"
        return 1
    fi
}

# Main execution
main() {
    # Validate inputs
    validate_args "$@"
    readonly APP_NAME="$1"
    
    # Validate dependencies first (needed for jq in validate_app_name)
    validate_dependencies
    validate_app_name "$APP_NAME"
    
    # Set paths
    readonly TARGET_DIR="apps/$APP_NAME"
    readonly TARGET_FILE="$TARGET_DIR/.env"
    
    # Validate environment
    validate_target_dir "$TARGET_DIR"
    
    # Read and validate configuration
    read_config "$APP_NAME"
    validate_config "$PROJECT_ID" "$SECRET_NAME"
    
    # Download and verify
    if download_secret "$PROJECT_ID" "$SECRET_NAME" "$TARGET_FILE"; then
        show_file_info "$TARGET_FILE"
    else
        exit 1
    fi
}

# Run main function with all arguments
main "$@" 
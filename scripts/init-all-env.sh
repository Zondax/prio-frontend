#!/bin/bash

# init-all-env.sh - Initialize environment files for all apps
# Usage: ./scripts/init-all-env.sh

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly CONFIG_FILE="$PROJECT_ROOT/env-config.json"
readonly INIT_SCRIPT="$SCRIPT_DIR/init-env.sh"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_header() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Result tracking
declare -a success_apps=()
declare -a failed_apps=()

# Core functions
init_single_app() {
    local app="$1"
    log_header "Initializing $app"
    
    if INIT_ALL_MODE=1 "$INIT_SCRIPT" "$app" 2>&1; then
        success_apps+=("$app")
        log_success "✅ $app environment initialized successfully"
        return 0
    else
        failed_apps+=("$app")
        log_error "❌ $app environment initialization failed"
        return 1
    fi
}

print_summary() {
    local total_apps=${#APPS[@]}
    local success_count=${#success_apps[@]}
    local failed_count=${#failed_apps[@]}
    
    log_header "Summary"
    echo -e "${CYAN}Total apps: $total_apps${NC}"
    echo -e "${GREEN}Successful: $success_count${NC}"
    echo -e "${RED}Failed: $failed_count${NC}"
    echo ""
    
    # Print detailed results
    for app in "${APPS[@]}"; do
        if [[ " ${success_apps[*]} " =~ " $app " ]]; then
            echo -e "${GREEN}✓${NC} $app: Environment file ready"
        else
            echo -e "${RED}✗${NC} $app: Failed to initialize"
        fi
    done
    echo ""
    
    # Final status
    if [[ $success_count -eq $total_apps ]]; then
        log_success "🎉 All environments initialized successfully!"
        return 0
    elif [[ $success_count -gt 0 ]]; then
        log_warning "⚠️  Some environments initialized successfully, others failed"
        log_info "Check the logs above for details on failed apps"
        return 0
    else
        log_error "❌ All environment initializations failed"
        log_info "Please check your GCP configuration and authentication"
        return 1
    fi
}

# Main execution
main() {
    # Check dependencies
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed"
        echo "Install: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        exit 1
    fi

    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi

    # Read apps from config file
    local apps_array
    if ! apps_array=$(jq -r '.gcp.secrets | keys[]' "$CONFIG_FILE" 2>/dev/null); then
        log_error "Failed to read apps from config file"
        exit 1
    fi

    # Convert to array (compatible with older bash versions)
    IFS=$'\n' read -d '' -r -a APPS <<< "$apps_array" || true

    log_header "Environment Initialization for All Apps"
    log_info "Initializing environment files for: ${APPS[*]}"
    echo ""
    
    # Initialize each app
    for app in "${APPS[@]}"; do
        init_single_app "$app"
        echo ""
    done
    
    # Print summary and exit with appropriate code
    if print_summary; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@" 
#!/bin/bash

# =============================================================================
# Submodule Update Script for Vercel Build Environment
# =============================================================================
# This script updates git submodules using GitHub App authentication.
# It generates a JWT token from a PEM key, obtains an installation access token,
# and uses it to authenticate git operations for private repositories.
#
# Required Environment Variables:
# - PULUMI_GOLEM_APP_PEM: GitHub App private key (PEM format)
# - PULUMI_GITHUB_APP_ID: GitHub App ID
# - PULUMI_GITHUB_INSTALLATION_ID: GitHub App installation ID
# =============================================================================

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail  # Exit if any command in a pipeline fails

# =============================================================================
# ENVIRONMENT VALIDATION
# =============================================================================

echo "🔄 Starting submodule update process..."

# Validate required environment variables
if [ -z "$PULUMI_GOLEM_APP_PEM" ]; then
    echo "❌ Error: PULUMI_GOLEM_APP_PEM environment variable is not set"
    echo "Please set the PULUMI_GOLEM_APP_PEM environment variable with your GitHub App's private key"
    exit 1
fi

if [ -z "$PULUMI_GITHUB_APP_ID" ]; then
    echo "❌ Error: PULUMI_GITHUB_APP_ID environment variable is not set"
    echo "Please set the PULUMI_GITHUB_APP_ID environment variable with your GitHub App's ID"
    exit 1
fi

if [ -z "$PULUMI_GITHUB_INSTALLATION_ID" ]; then
    echo "❌ Error: PULUMI_GITHUB_INSTALLATION_ID environment variable is not set"
    echo "Please set the PULUMI_GITHUB_INSTALLATION_ID environment variable with your GitHub App's installation ID"
    exit 1
fi

echo "✅ Environment variables validated successfully"

# =============================================================================
# GITHUB APP AUTHENTICATION
# =============================================================================

echo "🔑 Generating GitHub App installation token..."

# JWT generation using GitHub's official method
# Reference: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app

# Calculate timestamps
now=$(date +%s)
iat=$((${now} - 60))  # Issues 60 seconds in the past
exp=$((${now} + 600)) # Expires 10 minutes in the future

# Base64 URL encoding function
b64enc() { 
    openssl base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n'
}

# Create JWT header
header_json='{
    "typ":"JWT",
    "alg":"RS256"
}'
header=$(echo -n "${header_json}" | b64enc)

# Create JWT payload
payload_json="{
    \"iat\":${iat},
    \"exp\":${exp},
    \"iss\":\"${PULUMI_GITHUB_APP_ID}\"
}"
payload=$(echo -n "${payload_json}" | b64enc)

# Create signature
header_payload="${header}.${payload}"
signature=$(
    openssl dgst -sha256 -sign <(echo -n "${PULUMI_GOLEM_APP_PEM}") \
    <(echo -n "${header_payload}") | b64enc
)

# Assemble JWT token
JWT_TOKEN="${header_payload}.${signature}"

echo "✅ JWT token generated successfully"

# Get installation access token
echo "🎫 Obtaining installation access token..."

INSTALLATION_TOKEN_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$PULUMI_GITHUB_INSTALLATION_ID/access_tokens")

# Extract token from response
INSTALLATION_TOKEN=$(echo "$INSTALLATION_TOKEN_RESPONSE" | tr ',' '\n' | grep '"token"' | cut -d'"' -f4)

if [ -z "$INSTALLATION_TOKEN" ]; then
    echo "❌ Error: Failed to obtain installation access token"
    echo "API Response: $INSTALLATION_TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Installation access token obtained successfully"

# =============================================================================
# GIT CONFIGURATION AND SUBMODULE UPDATE
# =============================================================================

# Configure git to use the installation token for HTTPS authentication
git config --global url."https://x-access-token:${INSTALLATION_TOKEN}@github.com/".insteadOf "https://github.com/"

echo "🔧 Git HTTPS authentication configured"

# Clean up existing submodule directories to prevent conflicts
echo "🧹 Preparing clean environment for submodules..."

if [ -d "libs" ]; then
    echo "📁 Removing existing libs directory..."
    rm -rf libs
fi

# Ensure clean submodule state
echo "🔄 Resetting submodule state..."
git submodule deinit --all -f 2>/dev/null || true

# Initialize and update submodules
echo "📦 Initializing git submodules..."
git submodule init

echo "⬇️  Updating git submodules..."
git submodule update --recursive

# =============================================================================
# POST-UPDATE TASKS
# =============================================================================

echo "✅ Submodule update completed successfully"

# Display updated submodules for verification
echo "📋 Updated submodules:"
git submodule status

# Reinstall dependencies to ensure consistency
echo "📦 Reinstalling dependencies..."
pnpm install

echo "✅ Dependencies reinstalled successfully"
echo "🎉 Submodule update process completed successfully!" 
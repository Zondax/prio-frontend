#!/bin/bash

# Vercel build script with production release check

echo "🔍 Checking build environment..."
echo "   VERCEL_ENV: $VERCEL_ENV"
echo "   ALLOW_PRODUCTION_RELEASE: $ALLOW_PRODUCTION_RELEASE"

# Run the CI checkout and install dependencies
echo "📦 Running CI checkout and installing dependencies..."
npx -y @zondax/cli@latest ci checkout --install-deps

# Check if this is a production build without permission
if [ "$VERCEL_ENV" = "production" ] && [ "$ALLOW_PRODUCTION_RELEASE" != "true" ]; then
  echo ""
  echo "⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️"
  echo "⚠️                                                      ⚠️"
  echo "⚠️         PRODUCTION RELEASE NOT ALLOWED!              ⚠️"
  echo "⚠️                                                      ⚠️"
  echo "⚠️  To enable production builds, set:                  ⚠️"
  echo "⚠️  ALLOW_PRODUCTION_RELEASE=true                      ⚠️"
  echo "⚠️  in Vercel environment variables                    ⚠️"
  echo "⚠️                                                      ⚠️"
  echo "⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️"
  echo ""
  echo "🚫🚫🚫 REPLACING APP WITH NO-RELEASE VERSION 🚫🚫🚫"
  echo "🚫🚫🚫 THIS IS NOT THE REAL APPLICATION!     🚫🚫🚫"
  echo ""
  
  # Delete everything except build scripts and vercel config
  find . -maxdepth 1 -not -name '.' \
    -not -name 'build_vercel.sh' \
    -not -name 'vercel.json' \
    -exec rm -rf {} +
  
  # Copy all no-release app files
  cp -r ../../libs/no-release/* .
  
  # Install dependencies for no-release app
  echo "📦 Installing no-release dependencies..."
  pnpm install --frozen-lockfile
  
  # Build normally
  echo "🔨 Building no-release app..."
  pnpm build

  echo "✅ No-release build completed"
  
else
  # Normal production or non-production build
  echo "🚀 Building Next.js application..."
  pnpm build
  
  echo "✅ Application build completed"
fi
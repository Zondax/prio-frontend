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
  echo "⚠️  Production release not allowed!"
  echo "   To enable production builds, set ALLOW_PRODUCTION_RELEASE=true in Vercel environment variables."
  echo ""
  echo "📄 Using failsafe page instead of building the application..."
  
  # Create the .next directory structure for Vercel
  mkdir -p .next
  
  # Copy all failsafe files to .next directory
  cp failsafe/index.html .next/
  cp failsafe/server.js .next/
  cp failsafe/package.json .next/

  echo "✅ Failsafe build completed"
  
else
  # Normal production or non-production build
  echo "🚀 Building Next.js application..."
  pnpm build
  
  echo "✅ Application build completed"
fi
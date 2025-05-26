#!/bin/sh
# Check that expo-modules-autolinking is set to "*" in the given package.json
# Usage: ./scripts/check-expo-modules-autolinking.sh [path/to/package.json]

PKG_FILE="${1:-apps/expo/package.json}"

if [ ! -f "$PKG_FILE" ]; then
  echo "Error: File $PKG_FILE does not exist." >&2
  exit 1
fi

# Check all dependency sections for expo-modules-autolinking
value=$(jq -r '.dependencies["expo-modules-autolinking"] // .devDependencies["expo-modules-autolinking"] // .peerDependencies["expo-modules-autolinking"] // .optionalDependencies["expo-modules-autolinking"] // empty' "$PKG_FILE")

if [ "$value" = "*" ]; then
  echo "expo-modules-autolinking is correctly set to '*' in $PKG_FILE."
  exit 0
else
  echo "Error: 'expo-modules-autolinking' is missing or not set to '*' in $PKG_FILE." >&2
  echo "jq output for all relevant sections:" >&2
  jq '{dependencies, devDependencies, peerDependencies, optionalDependencies}' "$PKG_FILE"
  echo "Current value found: '${value:-null}'" >&2
  exit 1
fi

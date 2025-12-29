#!/bin/bash

# Build script for Mira Verify WordPress plugin

cd "$(dirname "$0")"

# Clean up old build
rm -f mira-verify.zip

# Create zip excluding dev files and wordpress.org assets
zip -r mira-verify.zip . \
  -x "*.sh" \
  -x "docker-compose.yml" \
  -x ".git/*" \
  -x ".gitignore" \
  -x ".DS_Store" \
  -x "*.zip" \
  -x ".wordpress-org/*"

echo "✓ Built mira-verify.zip"

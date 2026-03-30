#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="color-scheme-toggle.zip"

mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR/$PACKAGE_NAME"

cd "$ROOT_DIR"

# Package only the extension payload at the archive root.
zip -r -FS "$DIST_DIR/$PACKAGE_NAME" \
  manifest.json \
  background.js \
  -x '*.DS_Store' \
  -x '__MACOSX/*' \
  -x '*/._*'

echo "Created $DIST_DIR/$PACKAGE_NAME"

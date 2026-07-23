#!/usr/bin/env bash
set -euo pipefail

SOURCE_BUILD_DIR="/home/ahmad/projects/ckeditor-mathlive/build"
SOURCE_ADAPTER_FILE="/home/ahmad/projects/ckeditor-mathlive/review/ci4-upload-adapter.production.js"
TARGET_DIR="/home/ahmad/projects/asesmenpedia.test/public/assets/plugins/editors/ckeditor"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_DIR="${TARGET_DIR}/backup_${TIMESTAMP}"

if [[ ! -d "$SOURCE_BUILD_DIR" ]]; then
  echo "Error: source build directory not found: $SOURCE_BUILD_DIR" >&2
  exit 1
fi

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: target directory not found: $TARGET_DIR" >&2
  exit 1
fi

shopt -s nullglob
source_files=("$SOURCE_BUILD_DIR"/*.js "$SOURCE_BUILD_DIR"/*.map)
shopt -u nullglob

if [[ ! -f "$SOURCE_ADAPTER_FILE" ]]; then
  echo "Warning: upload adapter source not found: $SOURCE_ADAPTER_FILE" >&2
else
  source_files+=("$SOURCE_ADAPTER_FILE")
fi

if [[ ${#source_files[@]} -eq 0 ]]; then
  echo "No .js or .map files found in $SOURCE_DIR"
  exit 0
fi

files_to_backup=()
for src in "${source_files[@]}"; do
  base_name="$(basename "$src")"
  target_file="$TARGET_DIR/$base_name"

  if [[ -f "$target_file" ]]; then
    files_to_backup+=("$target_file")
  fi
done

if [[ ${#files_to_backup[@]} -gt 0 ]]; then
  mkdir -p "$BACKUP_DIR"

  for old_file in "${files_to_backup[@]}"; do
    cp -p "$old_file" "$BACKUP_DIR/"
  done

  echo "Backed up ${#files_to_backup[@]} file(s) to: $BACKUP_DIR"
else
  echo "No existing target files to back up."
fi

for src in "${source_files[@]}"; do
  base_name="$(basename "$src")"
  target_file="$TARGET_DIR/$base_name"

  if [[ "$base_name" == "ci4-upload-adapter.production.js" ]]; then
    cp -f "$src" "$TARGET_DIR/upload-adapter.js"
    echo "Copied: upload-adapter.js (from ci4-upload-adapter.production.js)"
  else
    cp -f "$src" "$TARGET_DIR/"
    echo "Copied: $base_name"
  fi
done

echo "Done. Build assets and upload adapter synced to: $TARGET_DIR"

#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="/home/ahmad/projects/ckeditor-mathlive/build"
TARGET_DIR="/home/ahmad/projects/asesmenpedia.test/public/assets/plugins/editors/ckeditor"
TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_DIR="${TARGET_DIR}/backup_${TIMESTAMP}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: target directory not found: $TARGET_DIR" >&2
  exit 1
fi

shopt -s nullglob
source_files=("$SOURCE_DIR"/*.js "$SOURCE_DIR"/*.map)
shopt -u nullglob

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
  cp -f "$src" "$TARGET_DIR/"
  echo "Copied: $(basename "$src")"
done

echo "Done. Build assets synced to: $TARGET_DIR"

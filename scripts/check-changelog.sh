#!/usr/bin/env bash
set -euo pipefail

check_changelog() {
  local file="$1"
  local unreleased_line
  local release_line
  local version
  local first_version

  unreleased_line=$(grep -n "^## \[Unreleased\]" "$file" | head -1 | cut -d: -f1 || true)
  release_line=$(grep -n "^## \[[0-9]" "$file" | head -1 | cut -d: -f1 || true)

  # No [Unreleased] section — nothing to check
  if [ -z "$unreleased_line" ]; then
    return 0
  fi

  # [Unreleased] is below the latest release — fine
  if [ -n "$release_line" ] && [ "$unreleased_line" -gt "$release_line" ]; then
    return 0
  fi

  version=$(jq -r '.version' package.json)
  echo "Error: $file contains an [Unreleased] section above the latest release."
  echo "Stamp a released version that matches package.json (${version}) before publishing."
  return 1
}

verify_release_version() {
  local file="$1"
  local package_version
  local changelog_version

  package_version=$(jq -r '.version' package.json)
  changelog_version=$(grep -m1 "^## \[[0-9]" "$file" | sed -E 's/^## \[([0-9]+(\.[0-9]+)*).*/\1/' || true)

  if [ -z "$changelog_version" ]; then
    echo "Error: $file has no released version heading."
    echo "Add ## [${package_version}] before publishing."
    return 1
  fi

  if [ "$changelog_version" != "$package_version" ]; then
    echo "Error: $file latest release (${changelog_version}) does not match package.json (${package_version})."
    return 1
  fi

  return 0
}

check_changelog CHANGELOG.md
verify_release_version CHANGELOG.md

if [ -f src/CHANGELOG.md ]; then
  check_changelog src/CHANGELOG.md
  verify_release_version src/CHANGELOG.md
fi

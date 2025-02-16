#!/bin/bash

set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "You have uncommitted changes. Please commit or stash them before releasing."
  exit 1
fi

npm version ${1:-patch} -m "chore(release): v%s"
git push --follow-tags

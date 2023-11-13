#!/bin/bash
#
# Husky places scripts into .git/hooks when first installed. Those script will not be checked/re-created on `npm install`
# unless the version of husky has changed or root node_modules is recreated. Consequently, it's possible to be in a state
# where husky is installed but does not run it's hook and running `npm install` or `npm run init` does not resolve it.
# This script is run to check if those scripts are missing and rebuild them if they are to prevent that from happening.
#
# The absolute path is not needed here so some optimistic assumptions that make working with POSIX easier:
#   assume: .git lives in <root_dir>
#   assume: $(pwd) is <root_dir>
#     else: $(pwd) is `<root_dir>/scripts/env`
#     else: expect [ <root_dir> == $1 ] to be true

pre_commit_path=.git/hooks/pre-commit

pre_commit_exists() {
  [ -r "$(pwd)/${pre_commit_path}" ] \
  || [ -r "$(pwd)/../../${pre_commit_path}" ] \
  || { [ -n "$1" ] && [ -r "$($1)/${pre_commit_path}" ]; } \
  || return 1
}

build_husky() {
  echo "Husky pre-commit script not found, running 'npm build husky' to recreate them."
  npm rebuild husky
}

build_and_verify() {
  build_husky
  pre_commit_exists || echo "Could not locate husky pre-commit script after attempting 'npm rebuild'" >&2
}

pre_commit_exists "$@" || build_and_verify
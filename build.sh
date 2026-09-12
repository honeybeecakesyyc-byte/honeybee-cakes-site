#!/usr/bin/env bash
set -e
rm -rf dist
mkdir -p dist
cp index.html faq.html dist/
cp -R assets content dist/

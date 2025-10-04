#!/bin/bash

# Script to create GitHub labels with custom colors for the Express.js repository
# Run this script with: bash create-labels.sh

echo "Creating GitHub labels with custom colors..."

# Area labels - Different shades of blue/teal
gh label create "area: core" --color "0052cc" --description "Changes to core library files" --force
gh label create "area: application" --color "1f77b4" --description "Changes to application logic" --force
gh label create "area: request" --color "2ca02c" --description "Changes to request handling" --force
gh label create "area: response" --color "ff7f0e" --description "Changes to response handling" --force
gh label create "area: router" --color "d62728" --description "Changes to routing functionality" --force
gh label create "area: view" --color "9467bd" --description "Changes to view/templating" --force
gh label create "area: utils" --color "8c564b" --description "Changes to utility functions" --force
gh label create "area: tests" --color "e377c2" --description "Changes to test files" --force
gh label create "area: examples" --color "7f7f7f" --description "Changes to example code" --force
gh label create "area: docs" --color "17becf" --description "Changes to documentation" --force
gh label create "area: config" --color "bcbd22" --description "Changes to configuration files" --force
gh label create "area: benchmarks" --color "ff9896" --description "Changes to benchmark files" --force
gh label create "area: security" --color "c5b0d5" --description "Changes to security-related files" --force
gh label create "area: ci" --color "c49c94" --description "Changes to CI/CD workflows" --force

# Special labels - Distinct colors
gh label create "dependencies" --color "0366d6" --description "Changes to package dependencies" --force
gh label create "breaking change" --color "b60205" --description "Changes that may break compatibility" --force

# Size labels - Gradient from green to red
gh label create "size: small" --color "00ff00" --description "Small changes (1-3 files)" --force
gh label create "size: medium" --color "ffff00" --description "Medium changes (4-10 files)" --force
gh label create "size: large" --color "ff8000" --description "Large changes (11-50 files)" --force
gh label create "size: extra-large" --color "ff0000" --description "Extra large changes (51+ files)" --force

echo "✅ All labels created successfully!"
echo "You can view them at: https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/labels"

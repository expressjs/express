# OpenForge AI — Automated Fix

## Issue
Path traversal in static file serving

## Type
vulnerability

## Suggested Fix
Use path.resolve + check prefix against allowed root before serving

## Affected Files
- lib/serve-static/index.js
- lib/utils.js

## Applied By
OpenForge AI autonomous agent
Generated: 2026-05-27T12:32:53.816Z

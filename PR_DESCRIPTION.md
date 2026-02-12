# PR Description

## Summary

Improved error messages for `path-to-regexp` errors by adding route path information, making it easier for developers to identify invalid route definitions.

## Problem

When defining routes with invalid path-to-regexp syntax (e.g., `/api/:` with missing parameter name), the error message was:

```
TypeError: Missing parameter name at 1
```

This error message did not indicate which route caused the problem, making it difficult to debug, especially in large applications with many routes.

## Solution

Modified the `app.route()` method in `lib/application.js` to catch path-to-regexp errors and enhance them with the route path information. Now the same error shows:

```
TypeError: Missing parameter name at 1 for path "/api/:"
```

## Changes

- **lib/application.js**: Added try-catch block in `app.route()` to enhance path-to-regexp errors
- **test/app.route.error.js**: Added tests to verify the enhanced error messages

## Test Results

All existing tests pass (1251 passing), plus 5 new tests for error handling enhancement.

## Examples

### Before
```
TypeError: Missing parameter name at 1
    at name (/node_modules/path-to-regexp/dist/index.js:85:19)
```

### After
```
TypeError: Missing parameter name at 1 for path "/api/:"
    at name (/node_modules/path-to-regexp/dist/index.js:85:19)
```

## Related Issue

Fixes #5936
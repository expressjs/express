# Project

## Project Overview

This repository contains a software project with automated build and test infrastructure. The codebase includes multiple components requiring different build steps and validation processes.

## Build & Test Commands

### Build Commands
```bash
# Primary build command
make build

# Alternative/additional build targets
make all
```

### Test Commands
```bash
# Run test suite
make test

# Run specific test categories (if applicable)
make unit-test
make integration-test
```

### Other Useful Commands
```bash
# Clean build artifacts
make clean

# Install dependencies
make install

# Lint/format code
make lint
make format
```

## High-Risk Areas

- **Build Configuration**: Changes to Makefiles or build scripts can break the entire build process
- **Dependency Management**: Updates to dependency versions or package management files require careful testing
- **Core Logic**: Modifications to primary business logic should be reviewed thoroughly before merging
- **Integration Points**: Areas where different components interact are prone to regression issues

## Code Conventions

- Follow the existing code style and formatting patterns present in the repository
- Ensure all changes pass linting and formatting checks before committing
- Add or update tests for any new functionality or bug fixes
- Keep commits focused and atomic for easier review and potential rollback
- Document public APIs and complex logic with clear comments

## Recent Work Context

The project appears to have standard development infrastructure in place. When working on this codebase:

- Always run tests locally before pushing changes
- Use the provided build commands to verify your changes don't break existing functionality
- Check that any new files follow the established project structure
- Ensure dependency changes are reflected in appropriate configuration files

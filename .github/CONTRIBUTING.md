# Contributing to Express

This document contains aggregated information on the project's development workflow, setup, and guidelines derived from the repository.

## Development Environment Setup
- **Prerequisites:** Node.js v18 or higher must be installed.
- **Setup Steps:**
  1. Fork and clone the repository.
  2. Run `npm install` to install all necessary dependencies.

## Code Style Guidelines and Linting Configuration
- **Linter:** The project uses **ESLint** to maintain code quality. The configuration can be found in `.eslintrc.yml`.
- **Scripts:**
  - Run `npm run lint` to check your code for formatting and syntax issues.
  - Run `npm run lint:fix` to automatically fix formatting issues.

## Git Workflow
- **Branch Naming:** Create a descriptive feature branch for your work (e.g., `git checkout -b feat/your-feature`).
- **Commit Messages:** Use descriptive and conventional commit messages (e.g., `feat: update cookie parsing logic`).
- **Pull Requests:** Ensure your PR is linked to the relevant issue (e.g., include `Closes #43`).

## Pull Request Template and Checklist
*Note: A dedicated Pull Request template is not present directly in this repository (it may be inherited from the `expressjs/.github` organization repository).* 

**Checklist before submitting a PR:**
- [ ] Code follows the ESLint style guidelines (`npm run lint`).
- [ ] All standard tests pass (`npm test`).
- [ ] A descriptive commit message is provided.
- [ ] The PR is explicitly linked to an existing issue.

## How to Run Tests Locally
- **Standard Test Suite:** Run `npm test`
- **Test Coverage:** Run `npm run test-cov` (this will generate an HTML report in the `/coverage` folder).

## How to Report Bugs
- Bugs should be reported using the **GitHub Issue tracker**.
- When reporting a bug, always include:
  - Your configured Node.js version.
  - Detailed steps to reproduce the error.

## Code of Conduct Reference
- The Express project adheres to a Code of Conduct. 
- You can review the full guidelines here: [Express Code of Conduct](https://github.com/expressjs/.github/blob/HEAD/CODE_OF_CONDUCT.md).
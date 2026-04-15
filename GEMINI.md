<!-- crag:auto-start -->
# GEMINI.md

> Generated from governance.md by crag. Regenerate: `crag compile --target gemini`

## Project Context

- **Name:** express
- **Description:** Fast, unopinionated, minimalist web framework
- **Stack:** node
- **Runtimes:** node

## Rules

### Quality Gates

Run these checks in order before committing any changes:

1. [lint] `npm run lint`
2. [test] `npm run test`
3. [ci (inferred from workflow)] `npm run test-ci`

### Security

- No hardcoded secrets — grep for sk_live, AKIA, password= before commit

### Workflow

- Conventional commits (feat:, fix:, docs:, chore:, etc.)
- Commit trailer: Co-Authored-By: Claude <noreply@anthropic.com>
- Run quality gates before committing
- Review security implications of all changes

<!-- crag:auto-end -->

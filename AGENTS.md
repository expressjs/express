<!-- crag:auto-start -->
# AGENTS.md

> Generated from governance.md by crag. Regenerate: `crag compile --target agents-md`

## Project: express

Fast, unopinionated, minimalist web framework

## Quality Gates

All changes must pass these checks before commit:

### Lint
1. `npm run lint`

### Test
1. `npm run test`

### Ci (inferred from workflow)
1. `npm run test-ci`

## Coding Standards

- Stack: node
- Conventional commits (feat:, fix:, docs:, etc.)
- Commit trailer: Co-Authored-By: Claude <noreply@anthropic.com>

## Architecture

- Type: monolith

## Key Directories

- `.github/` — CI/CD
- `lib/` — source
- `test/` — tests

## Testing

- Framework: mocha
- Layout: flat

## Code Style

- Indent: 2 spaces
- Linter: eslint

## Anti-Patterns

Do not:
- Do not leave `console.log` in production code — use a proper logger
- Do not use synchronous filesystem APIs in request handlers

## Security

- No hardcoded secrets — grep for sk_live, AKIA, password= before commit

## Workflow

1. Read `governance.md` at the start of every session — it is the single source of truth.
2. Run all mandatory quality gates before committing.
3. If a gate fails, fix the issue and re-run only the failed gate.
4. Use the project commit conventions for all changes.

<!-- crag:auto-end -->

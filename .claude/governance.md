# Governance — express
# Inferred by crag analyze — review and adjust as needed

## Identity
- Project: express
- Description: Fast, unopinionated, minimalist web framework
- Stack: node

## Gates (run in order, stop on failure)
### Lint
- npm run lint

### Test
- npm run test

### CI (inferred from workflow)
- npm run test-ci

## Advisories (informational, not enforced)
- actionlint  # [ADVISORY]

## Branch Strategy
- Trunk-based development
- Conventional commits
- Commit trailer: Co-Authored-By: Claude <noreply@anthropic.com>

## Security
- No hardcoded secrets — grep for sk_live, AKIA, password= before commit

## Autonomy
- Auto-commit after gates pass

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

## Import Conventions
- Module system: CJS

## Anti-Patterns

Do not:
- Do not leave `console.log` in production code — use a proper logger
- Do not use synchronous filesystem APIs in request handlers


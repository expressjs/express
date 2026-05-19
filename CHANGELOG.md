### Changed
- **BREAKING CHANGE:** `allowPrototypes` option for extended query parser now defaults to `false`. This filters out `__proto__`, `constructor`, and `prototype` keys from parsed query strings to prevent prototype pollution attacks. Applications intentionally using these as query parameter names will need to configure a custom query parser.

# README guidelines

Every module in the expressjs, pillarjs, and jshttp organizations should have
a README file named `README.md`. The purpose of the README is to:

- Explain the purpose of the module and how to use it.
- Act as a landing page (both on GitHub and npmjs.com) for the module to help
  people find it via search. Middleware module READMEs are also incorporated
  into https://expressjs.com/en/resources/middleware.html.
- Encourage community contributions and participation.

Use the [README template](https://github.com/expressjs/express/wiki/README-template)
to quickly create a new README file.

## Top-level items

**Badges** (optional): At the very top (with no subheading), include any
applicable badges, such as npm version/downloads, build status, test coverage,
and so on. Badges should resolve properly (not display a broken image).

Possible badges include:
- npm version: `[![NPM Version][npm-image]][npm-url]`
- npm downloads: `[![NPM Downloads][downloads-image]][downloads-url]`
- Build status: `[![Build Status][travis-image]][travis-url]`
- Test coverage: `[![Test Coverage][coveralls-image]][coveralls-url]`
- Tips: `[![Gratipay][gratipay-image]][gratipay-url]`

**Summary**: Following badges, provide a one- or two-sentence description of
what the module does. This should be the same as the npmjs.org blurb (which
comes from the description property of `package.json`). Since npm doesn't
handle markdown for the blurb, avoid using markdown in the summary sentence.

**TOC** (Optional): For longer READMEs, provide a table of contents that has
a relative link to each section. A tool such as
[doctoc](https://www.npmjs.com/package/doctoc) makes it very easy to generate
a TOC.

## Overview

Optionally, include a section of one or two paragraphs with more high-level
information on what the module does, what problems it solves, why one would
use it and how.  Don't just repeat what's in the summary.

## Installation

Required. This section is typically just:

```sh
$ npm install module-name
```

But include any other steps or requirements.

NOTE: Use the `sh` code block to make the shell command display properly on
the website.

## Basic use

- Provide a general description of how to use the module with code sample.
  Include any important caveats or restrictions.
- Explain the most common use cases.
- Optional: a simple "hello world" type example (where applicable). This
  example is in addition to the more comprehensive [example section](#examples)
  later.

## API

Provide complete API documentation.

Formatting conventions: Each function is listed in a 3rd-level heading (`###`),
like this:

```
### Function_name(arg, options [, optional_arg]  ... )
```

**Options objects**

For arguments that are objects (for example, options object), describe the
properties in a table, as follows. This matches the formatting used in the
[Express API docs](https://expressjs.com/en/4x/api.html).

|Property | Description | Type | Default|
|----------|-----------|------------|-------------|
|Name of the property in `monospace`. | Brief description | String, Number, Boolean, etc. | If applicable.|

If all the properties are required (i.e. there are no defaults), then you
can omit the default column.

Instead of very lengthy descriptions, link out to subsequent paragraphs for
more detailed explanation of specific cases (e.g. "When this property is set
to 'foobar', xyz happens; see &lt;link to following section &gt;.)

If there are options properties that are themselves options, use additional
tables. See [`trust proxy` and `etag` properties](https://expressjs.com/en/4x/api.html#app.settings.table).

## Examples

Every README should have at least one example; ideally more.  For code samples,
be sure to use the `js` code block, for proper display in the website, e.g.:

```js
var csurf = require('csurf')
...
```

## Tests

What tests are included.

How to run them.

The convention for running tests is `npm test`. All our projects should follow
this convention.

## Contributors

Names of module "owners" (lead developers) and other developers who have
contributed.

## License

Link to the license, with a short description of what it is, e.g. "MIT" or
whatever. Ideally, avoid putting the license text directly in the README; link
to it instead.

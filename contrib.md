
### Development Dependencies

Express development dependencies are stored within the _./support_ directory. To
update them execute:

    $ git submodule update --init

### Running Tests

Express uses the [Expresso](http://github.com/visionmedia/expresso) TDD
framework to write and run elegant test suites extremely fast. To run all test suites
simply execute:

    $ make test

To target specific suites we may specify the files via:

    $ make test TESTS=test/view.test.js

To check test coverage run:

    $ make test-cov

### Contributions

To accept a contribution, you should follow these guidelines:

  * All tests _must_ pass
  * Your alterations or additions _must_ include tests
  * Your commit(s) should be _focused_, do not commit once for several changes
  * Do _not_ alter release information such as the _version_, or _History.md_
  * Indents are _4_ spaces.

### Documentation

To contribute documentation edit the markdown files in _./docs_, however
do _not_ run _make docs_, as they will be re-built and published with each release.

0.1.0 / 2010-02-03
==================

  * Changed; Hooks (before / after) pass request as arg as well as evaluated in their context
  * Updated node support to 0.1.27 Closes #169
  * Updated dirname(__filename) -> __dirname
  * Updated libxmljs support to v0.2.0
  * Added session support with memory store / reaping
  * Added quick uid() helper
  * Added multi-part upload support
  * Added Sass.js support / submodule
  * Added production env caching view contents and static files
  * Added static file caching. Closes #136
  * Added cache plugin with memory stores
  * Added support to StaticFile so that it works with non-textual files.
  * Removed dirname() helper
  * Removed several globals (now their modules must be required)

0.0.2 / 2010-01-10
==================

  * Added view benchmarks; currently haml vs ejs
  * Added Request#attachment() specs. Closes #116
  * Added use of node's parseQuery() util. Closes #123
  * Added `make init` for submodules
  * Updated Haml
  * Updated sample chat app to show messages on load
  * Updated libxmljs parseString -> parseHtmlString
  * Fixed `make init` to work with older versions of git
  * Fixed specs can now run independant specs for those who cant build deps. Closes #127
  * Fixed issues introduced by the node url module changes. Closes 126.
  * Fixed two assertions failing due to Collection#keys() returning strings
  * Fixed faulty Collection#toArray() spec due to keys() returning strings
  * Fixed `make test` now builds libxmljs.node before testing

0.0.1 / 2010-01-03
==================

  * Initial release

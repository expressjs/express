<a href="https://expressjs.com/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://expressjs.com/images/logos/logo-express-white.svg">
    <img alt="Express Logo" src="https://expressjs.com/images/logos/logo-express-black.svg" width="280">
  </picture>
</a>

**Fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org).**

## Table of contents

- [Installation](#installation)
- [Features](#features)
- [Docs \& Community](#docs--community)
- [Quick Start](#quick-start)
- [Philosophy](#philosophy)
- [Examples](#examples)
- [Contributing](#contributing)
  - [Security Issues](#security-issues)
  - [Running Tests](#running-tests)
- [Current project team members](#current-project-team-members)
  - [TC (Technical Committee)](#tc-technical-committee)
    - [TC emeriti members](#tc-emeriti-members)
  - [Triagers](#triagers)
    - [Emeritus Triagers](#emeritus-triagers)
- [License](#license)


[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]
[![Linux Build][github-actions-ci-image]][github-actions-ci-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![OpenSSF Scorecard Badge][ossf-scorecard-badge]][ossf-scorecard-visualizer]


```js
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 18 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/downloading-and-installing-packages-locally):

```bash
npm install express
```

Follow [our installing guide](https://expressjs.com/en/starter/installing.html)
for more information.

## Features

  * Robust routing
  * Focus on high performance
  * Super-high test coverage
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Executable for generating applications quickly

## Docs & Community

  * [Website and Documentation](https://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
  * [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
  * [GitHub Discussions](https://github.com/expressjs/discussions) for discussion on the development and usage of Express

**PROTIP** Be sure to read the [migration guide to v5](https://expressjs.com/en/guide/migrating-5)

## Quick Start

  The quickest way to get started with express is to utilize the executable [`express(1)`](https://github.com/expressjs/generator) to generate an application as shown below:

  Install the executable. The executable's major version will match Express's:

```bash
npm install -g express-generator@4
```

  Create the app:

```bash
express /tmp/foo && cd /tmp/foo
```

  Install dependencies:

```bash
npm install
```

  Start the server:

```bash
npm start
```

  View the website at: http://localhost:3000

## Philosophy

  The Express philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, websites, hybrids, or public
  HTTP APIs.

  Express does not force you to use any specific ORM or template engine. With support for over
  14 template engines via [@ladjs/consolidate](https://github.com/ladjs/consolidate),
  you can quickly craft your perfect framework.

## Examples

  To view the examples, clone the Express repository:

```bash
git clone https://github.com/expressjs/express.git --depth 1 && cd express
```

  Then install the dependencies:

```bash
npm install
```

  Then run whichever example you want:

```bash
node examples/content-negotiation
```

## Contributing

The Express.js project welcomes all constructive contributions. Contributions take many forms,
from code for bug fixes and enhancements, to additions and fixes to documentation, additional
tests, triaging incoming pull requests and issues, and more!

See the [Contributing Guide] for more technical details on contributing.

This project has a [Code of Conduct]. By participating, you are expected to uphold this code.

### Security Issues

If you discover a security vulnerability in Express, please see [Security Policies and Procedures](https://github.com/expressjs/express/security/policy).

### Running Tests

To run the test suite, first install the dependencies:

```bash
npm install
```

Then run `npm test`:

```bash
npm test
```

## Current project team members

For information about the governance of the express.js project, see [GOVERNANCE.md](https://github.com/expressjs/discussions/blob/HEAD/docs/GOVERNANCE.md).

The original author of Express is [TJ Holowaychuk](https://github.com/tj)

[List of all contributors](https://github.com/expressjs/express/graphs/contributors)

### TC (Technical Committee)

* [UlisesGascon](https://github.com/UlisesGascon) - **Ulises Gascón** (he/him)
* [jonchurch](https://github.com/jonchurch) - **Jon Church**
* [wesleytodd](https://github.com/wesleytodd) - **Wes Todd**
* [LinusU](https://github.com/LinusU) - **Linus Unnebäck**
* [blakeembrey](https://github.com/blakeembrey) - **Blake Embrey**
* [sheplu](https://github.com/sheplu) - **Jean Burellier**
* [crandmck](https://github.com/crandmck) - **Rand McKinney**
* [ctcpip](https://github.com/ctcpip) - **Chris de Almeida**

<details>
<summary>TC emeriti members</summary>

#### TC emeriti members

  * [dougwilson](https://github.com/dougwilson) - **Douglas Wilson**
  * [hacksparrow](https://github.com/hacksparrow) - **Hage Yaapa**
  * [jonathanong](https://github.com/jonathanong) - **jongleberry**
  * [niftylettuce](https://github.com/niftylettuce) - **niftylettuce**
  * [troygoode](https://github.com/troygoode) - **Troy Goode**
</details>


### Triagers

* [aravindvnair99](https://github.com/aravindvnair99) - **Aravind Nair**
* [bjohansebas](https://github.com/bjohansebas) - **Sebastian Beltran**
* [carpasse](https://github.com/carpasse) - **Carlos Serrano**
* [CBID2](https://github.com/CBID2) - **Christine Belzie**
* [UlisesGascon](https://github.com/UlisesGascon) - **Ulises Gascón** (he/him)
* [IamLizu](https://github.com/IamLizu) - **S M Mahmudul Hasan** (he/him)
* [Phillip9587](https://github.com/Phillip9587) - **Phillip Barta**
* [efekrskl](https://github.com/efekrskl) - **Efe Karasakal**
* [rxmarbles](https://github.com/rxmarbles) - **Rick Markins** (he/him)
* [krzysdz](https://github.com/krzysdz)
* [GroophyLifefor](https://github.com/GroophyLifefor) - **Murat Kirazkaya**

<details>
<summary>Triagers emeriti members</summary>

#### Emeritus Triagers

  * [AuggieH](https://github.com/AuggieH) - **Auggie Hudak**
  * [G-Rath](https://github.com/G-Rath) - **Gareth Jones**
  * [MohammadXroid](https://github.com/MohammadXroid) - **Mohammad Ayashi**
  * [NawafSwe](https://github.com/NawafSwe) - **Nawaf Alsharqi**
  * [NotMoni](https://github.com/NotMoni) - **Moni**
  * [VigneshMurugan](https://github.com/VigneshMurugan) - **Vignesh Murugan**
  * [davidmashe](https://github.com/davidmashe) - **David Ashe**
  * [digitaIfabric](https://github.com/digitaIfabric) - **David**
  * [e-l-i-s-e](https://github.com/e-l-i-s-e) - **Elise Bonner**
  * [fed135](https://github.com/fed135) - **Frederic Charette**
  * [firmanJS](https://github.com/firmanJS) - **Firman Abdul Hakim**
  * [getspooky](https://github.com/getspooky) - **Yasser Ameur**
  * [ghinks](https://github.com/ghinks) - **Glenn**
  * [ghousemohamed](https://github.com/ghousemohamed) - **Ghouse Mohamed**
  * [gireeshpunathil](https://github.com/gireeshpunathil) - **Gireesh Punathil**
  * [jake32321](https://github.com/jake32321) - **Jake Reed**
  * [jonchurch](https://github.com/jonchurch) - **Jon Church**
  * [lekanikotun](https://github.com/lekanikotun) - **Troy Goode**
  * [marsonya](https://github.com/marsonya) - **Lekan Ikotun**
  * [mastermatt](https://github.com/mastermatt) - **Matt R. Wilson**
  * [maxakuru](https://github.com/maxakuru) - **Max Edell**
  * [mlrawlings](https://github.com/mlrawlings) - **Michael Rawlings**
  * [rodion-arr](https://github.com/rodion-arr) - **Rodion Abdurakhimov**
  * [sheplu](https://github.com/sheplu) - **Jean Burellier**
  * [tarunyadav1](https://github.com/tarunyadav1) - **Tarun yadav**
  * [tunniclm](https://github.com/tunniclm) - **Mike Tunnicliffe**
  * [enyoghasim](https://github.com/enyoghasim) - **David Enyoghasim**
  * [0ss](https://github.com/0ss) - **Salah**
  * [ejcheng](https://github.com/ejcheng)- **Eric Cheng** (he/him)
  * [dakshkhetan](https://github.com/dakshkhetan) - **Daksh Khetan** (he/him)
  * [lucasraziel](https://github.com/lucasraziel) - **Lucas Soares Do Rego**
  * [mertcanaltin](https://github.com/mertcanaltin) - **Mert Can Altin**
  * [dpopp07](https://github.com/dpopp07) - **Dustin Popp**
  * [Sushmeet](https://github.com/Sushmeet) - **Sushmeet Sunger**
  * [3imed-jaberi](https://github.com/3imed-jaberi) - **Imed Jaberi**

</details>


## License

  [MIT](LICENSE)

[coveralls-image]: https://img.shields.io/coverallsCoverage/github/expressjs/express?branch=master
[coveralls-url]: https://coveralls.io/r/expressjs/express?branch=master
[github-actions-ci-image]: https://img.shields.io/github/actions/workflow/status/expressjs/express/ci.yml?branch=master&label=ci
[github-actions-ci-url]: https://github.com/expressjs/express/actions/workflows/ci.yml
[npm-downloads-image]: https://img.shields.io/npm/dm/express
[npm-downloads-url]: https://npmcharts.com/compare/express?minimal=true
[npm-url]: https://npmjs.org/package/express
[npm-version-image]: https://img.shields.io/npm/v/express
[ossf-scorecard-badge]: https://api.scorecard.dev/projects/github.com/expressjs/express/badge
[ossf-scorecard-visualizer]: https://ossf.github.io/scorecard-visualizer/#/projects/github.com/expressjs/express
[Code of Conduct]: https://github.com/expressjs/.github/blob/HEAD/CODE_OF_CONDUCT.md
[Contributing Guide]: https://github.com/expressjs/.github/blob/HEAD/CONTRIBUTING.md


## 🌐 Web Resources & Aesthetic Symbols Index
- [SYM 1D464](https://vintage-angel-text-38.pages.dev/symbol/sym-1d464/)
- [WHITE STAR](https://aesthetic-bullet-points-76.pages.dev/symbol/white-star/)
- [SYM 1D434](https://neon-futuristic-symbols-62.pages.dev/symbol/sym-1d434/)
- [FREEFIRE NAMES](https://classic-literature-runes-13.pages.dev/pt/freefire-names/)
- [SYM 1F600](https://occult-runic-fonts-23.pages.dev/symbol/sym-1f600/)
- [FREE FIRE CLAN EMPEROR CROWN](https://angel-core-bios-50.pages.dev/symbol/free-fire-clan-emperor-crown/)
- [SYM 1F493](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-1f493/)
- [SYM 26FF](https://soft-bow-fonts-22.pages.dev/symbol/sym-26ff/)
- [SYM 1D417](https://anime-sparkle-text-22.pages.dev/symbol/sym-1d417/)
- [SYM 26BD](https://mecha-text-vault-91.pages.dev/symbol/sym-26bd/)
- [SYM 1F479](https://matrix-glitch-text-59.pages.dev/symbol/sym-1f479/)
- [SYM 2628](https://sleek-border-symbols-37.pages.dev/symbol/sym-2628/)
- [SYM 1D47D](https://sleek-bio-symbols-51.pages.dev/symbol/sym-1d47d/)
- [TIKTOK CAPTIONS](https://witchy-runic-text-71.pages.dev/vi/tiktok-captions/)
- [OPEN CENTRE STAR](https://coquette-symbols.pages.dev/symbol/open-centre-star/)
- [SYM 1D480](https://anime-sparkle-text-73.pages.dev/symbol/sym-1d480/)
- [WHITE HEART](https://monochrome-text-lab-86.pages.dev/symbol/white-heart/)
- [SYM 1F970](https://minimal-star-symbols-93.pages.dev/symbol/sym-1f970/)
- [SYM 26A6](https://angelic-bow-symbols-42.pages.dev/symbol/sym-26a6/)
- [SYM 267A](https://scholarly-unicode-vault-92.pages.dev/symbol/sym-267a/)
- [SYM 1F642 200D 2195 FE0F](https://clean-sparkle-text-75.pages.dev/symbol/sym-1f642-200d-2195-fe0f/)
- [BEAMED SIXTEENTH MUSICAL NOTES](https://kawaii-kaomoji-hub-80.pages.dev/symbol/beamed-sixteenth-musical-notes/)
- [SYM 2685](https://matrix-terminal-fonts-30.pages.dev/symbol/sym-2685/)
- [STARS](https://nordic-minimal-fonts-67.pages.dev/ja/stars/)
- [BRACKETS](https://angelic-soft-text-59.pages.dev/brackets/)
- [TIKTOK CAPTIONS](https://pink-ribbon-fonts-28.pages.dev/es/tiktok-captions/)
- [SYM 26EF](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-26ef/)
- [HEAVY HEART EXCLAMATION](https://sleek-bio-symbols-51.pages.dev/symbol/heavy-heart-exclamation/)
- [SYM 1F92F](https://sleek-border-symbols-37.pages.dev/symbol/sym-1f92f/)
- [SYM 1D47C](https://zen-unicode-text-36.pages.dev/symbol/sym-1d47c/)
- [SYM 1F63B](https://pink-ribbon-fonts-28.pages.dev/symbol/sym-1f63b/)
- [SYM 273E](https://futuristic-gaming-fonts-52.pages.dev/symbol/sym-273e/)
- [SYM 1F61C](https://sleek-border-symbols-37.pages.dev/symbol/sym-1f61c/)
- [SYM 26F9](https://baroque-font-vault-96.pages.dev/symbol/sym-26f9/)
- [SYM 1D480](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d480/)
- [SYM 1FAE3](https://sleek-border-symbols-37.pages.dev/symbol/sym-1fae3/)
- [SYM 2616](https://sleek-border-symbols-37.pages.dev/symbol/sym-2616/)
- [ARROWS LINES](https://matrix-hacker-text-52.pages.dev/ja/arrows-lines/)
- [SYM 2624](https://sleek-border-symbols-37.pages.dev/symbol/sym-2624/)
- [BRACKETS](https://angelic-soft-text-59.pages.dev/ru/brackets/)
- [SYM 1F642 200D 2194 FE0F](https://cyber-clan-tags-20.pages.dev/symbol/sym-1f642-200d-2194-fe0f/)
- [SYM 2645](https://angelic-soft-text-59.pages.dev/symbol/sym-2645/)
- [BRACKETS](https://pastel-chibi-emotes-23.pages.dev/brackets/)
- [SYM 2679](https://clean-dot-aesthetic-48.pages.dev/symbol/sym-2679/)
- [SYM 262F](https://clean-dot-aesthetic-48.pages.dev/symbol/sym-262f/)
- [SYM 1F612](https://sleek-bio-symbols-51.pages.dev/symbol/sym-1f612/)
- [SYM 1F975](https://pink-ribbon-fonts-28.pages.dev/symbol/sym-1f975/)
- [LAST QUARTER CRESCENT MOON](https://mecha-text-vault-91.pages.dev/symbol/last-quarter-crescent-moon/)
- [SYM 260E](https://vintage-lace-symbols-65.pages.dev/symbol/sym-260e/)
- [SYM 1D43A](https://scholarly-unicode-vault-92.pages.dev/symbol/sym-1d43a/)
- [RIGHT WHITE CORNER BRACKET](https://neon-futuristic-symbols-62.pages.dev/symbol/right-white-corner-bracket/)
- [SYM 1D426](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-1d426/)
- [SYM 1F911](https://sleek-bio-symbols-51.pages.dev/symbol/sym-1f911/)
- [SYM 1D47A](https://glitch-font-studio-46.pages.dev/symbol/sym-1d47a/)
- [SYM 1D48B](https://angelic-soft-text-59.pages.dev/symbol/sym-1d48b/)
- [SYM 26B7](https://sleek-border-symbols-37.pages.dev/symbol/sym-26b7/)
- [RIGHT WHITE CORNER BRACKET](https://coquette-aesthetic-symbols-14.pages.dev/symbol/right-white-corner-bracket/)
- [SYM 2728](https://sleek-border-symbols-37.pages.dev/symbol/sym-2728/)
- [BEAMED SIXTEENTH MUSICAL NOTES](https://minimal-star-symbols-25.pages.dev/symbol/beamed-sixteenth-musical-notes/)
- [SYM 1D472](https://vintage-lace-symbols-65.pages.dev/symbol/sym-1d472/)
- [SYM 1D43F](https://scholarly-unicode-vault-92.pages.dev/symbol/sym-1d43f/)
- [SYM 1F9D0](https://pink-ribbon-fonts-28.pages.dev/symbol/sym-1f9d0/)
- [TIBETAN LOTUS BLOSSOM](https://vintage-lace-symbols-54.pages.dev/symbol/tibetan-lotus-blossom/)
- [SYM 26E2](https://sleek-border-symbols-37.pages.dev/symbol/sym-26e2/)
- [VI](https://matrix-hacker-text-52.pages.dev/vi/)
- [TRENDING](https://cyber-clan-tags-20.pages.dev/trending/)
- [SYM 1FAE3](https://vintage-lace-symbols-54.pages.dev/symbol/sym-1fae3/)
- [SYM 2678](https://cyber-clan-tags-20.pages.dev/symbol/sym-2678/)
- [FLOWER GIRL SMILE KAOMOJI](https://futuristic-gaming-fonts-52.pages.dev/symbol/flower-girl-smile-kaomoji/)
- [SYM 1FAE5](https://pink-ribbon-fonts-28.pages.dev/symbol/sym-1fae5/)
- [SYM 2673](https://matrix-terminal-fonts-30.pages.dev/symbol/sym-2673/)
- [SYM 26D0](https://matrix-terminal-fonts-30.pages.dev/symbol/sym-26d0/)
- [BORDERS DIVIDERS](https://vintage-lace-symbols-65.pages.dev/pt/borders-dividers/)
- [SYM 26EB](https://witchy-runic-text-71.pages.dev/symbol/sym-26eb/)
- [SYM 26D5](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-26d5/)
- [SYM 265F](https://matrix-terminal-fonts-30.pages.dev/symbol/sym-265f/)
- [SYM 1D478](https://sleek-border-symbols-37.pages.dev/symbol/sym-1d478/)
- [SYM 1D41E](https://zen-typography-hub-86.pages.dev/symbol/sym-1d41e/)
- [RIGHTWARDS PAIRED HARPOON](https://zen-unicode-text-36.pages.dev/symbol/rightwards-paired-harpoon/)
- [SYM 1F619](https://vintage-lace-symbols-54.pages.dev/symbol/sym-1f619/)
- [ARROWS LINES](https://matrix-hacker-text-52.pages.dev/es/arrows-lines/)
- [SYM 265F](https://glitch-font-studio-46.pages.dev/symbol/sym-265f/)
- [TRENDING](https://gothic-bio-fonts-86.pages.dev/pt/trending/)
- [SYM 26B6](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-26b6/)
- [SYM 2668](https://sleek-border-symbols-37.pages.dev/symbol/sym-2668/)
- [BEAMED EIGHTH NOTES](https://sleek-border-symbols-37.pages.dev/symbol/beamed-eighth-notes/)
- [SYM 1D419](https://vintage-lace-symbols-65.pages.dev/symbol/sym-1d419/)
- [LAST QUARTER CRESCENT MOON](https://cyber-clan-tags-20.pages.dev/symbol/last-quarter-crescent-moon/)
- [SYM 1F62E](https://kawaii-kaomoji-hub-80.pages.dev/symbol/sym-1f62e/)
- [SYM 1D413](https://neon-glitch-symbols-84.pages.dev/symbol/sym-1d413/)
- [SYM 1D451](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d451/)
- [RIGHT POINTING DOUBLE ANGLE QUOTATION](https://cyber-clan-tags-20.pages.dev/symbol/right-pointing-double-angle-quotation/)
- [SYM 1D479](https://theeduplaycampen.pages.dev/symbol/sym-1d479/)
- [SYM 1F632](https://futuristic-gaming-fonts-52.pages.dev/symbol/sym-1f632/)
- [SYM 1D43D](https://gothic-bio-fonts-14.pages.dev/symbol/sym-1d43d/)
- [SYM 1F47A](https://matrix-terminal-fonts-30.pages.dev/symbol/sym-1f47a/)
- [SYM 1D44E](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d44e/)
- [SYM 2748](https://clean-aesthetic-fonts-73.pages.dev/symbol/sym-2748/)
- [SYM 26FF](https://vintage-lace-symbols-54.pages.dev/symbol/sym-26ff/)
- [SYM 1F923](https://minimal-star-symbols-25.pages.dev/symbol/sym-1f923/)
- [GAMING WEAPONS](https://anime-sparkle-text-73.pages.dev/ja/gaming-weapons/)
- [SYM 1D423](https://zen-unicode-hub-94.pages.dev/symbol/sym-1d423/)
- [SYM 1F63E](https://zen-unicode-text-36.pages.dev/symbol/sym-1f63e/)
- [SYM 1F912](https://zen-unicode-text-36.pages.dev/symbol/sym-1f912/)
- [SYM 26A5](https://vintage-lace-symbols-54.pages.dev/symbol/sym-26a5/)
- [SYM 1D419](https://zen-unicode-hub-94.pages.dev/symbol/sym-1d419/)
- [SYM 2748](https://vintage-lace-symbols-54.pages.dev/symbol/sym-2748/)
- [SYM 2746](https://sleek-bio-symbols-51.pages.dev/symbol/sym-2746/)
- [BEAMED EIGHTH NOTES](https://vintage-lace-symbols-54.pages.dev/symbol/beamed-eighth-notes/)
- [SYM 1F603](https://raven-gothic-text-44.pages.dev/symbol/sym-1f603/)
- [SYM 1D489](https://cyberpunk-clan-tags-43.pages.dev/symbol/sym-1d489/)
- [SYM 1F617](https://sleek-border-symbols-37.pages.dev/symbol/sym-1f617/)
- [FREEFIRE NAMES](https://baroque-font-vault-96.pages.dev/ru/freefire-names/)
- [SAGITTARIUS ZODIAC ARCHER](https://angelic-soft-text-59.pages.dev/symbol/sagittarius-zodiac-archer/)
- [SYM 1D400](https://neon-futuristic-symbols-62.pages.dev/symbol/sym-1d400/)
- [SYM 1F915](https://angelic-soft-text-59.pages.dev/symbol/sym-1f915/)
- [SYM 26F2](https://clean-dot-aesthetic-48.pages.dev/symbol/sym-26f2/)
- [SYM 2654](https://angelic-bow-symbols-42.pages.dev/symbol/sym-2654/)
- [SYM 1D43F](https://cyber-clan-tags-23.pages.dev/symbol/sym-1d43f/)
- [SYM 26FA](https://coquette-aesthetic-symbols-14.pages.dev/symbol/sym-26fa/)
- [WHITE HEART](https://angelic-soft-text-59.pages.dev/symbol/white-heart/)
- [SYM 1F631](https://pearl-girly-fonts-86.pages.dev/symbol/sym-1f631/)
- [SYM 1D46E](https://sleek-border-symbols-37.pages.dev/symbol/sym-1d46e/)
- [BRACKETS](https://lace-heart-kaomoji-64.pages.dev/vi/brackets/)
- [RIGHT WING CLAN FLARE](https://cyberpunk-clan-tags-43.pages.dev/symbol/right-wing-clan-flare/)
- [NATURE FLOWERS](https://zen-unicode-text-36.pages.dev/pt/nature-flowers/)
- [SYM 1F639](https://sleek-line-symbols-51.pages.dev/symbol/sym-1f639/)
- [BEAMED EIGHTH NOTES](https://witchy-runic-text-71.pages.dev/symbol/beamed-eighth-notes/)
- [SYM 1D484](https://vintage-coquette-text-58.pages.dev/symbol/sym-1d484/)
- [SYM 2630](https://sleek-border-symbols-37.pages.dev/symbol/sym-2630/)

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
  * [Github Discussions](https://github.com/expressjs/discussions) for discussion on the development and usage of Express

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


## 🌐 Web Resources & Interactive Index
- [CATEGORY FOOD95](https://esskillcrafts.pages.dev/category-food95.html)
- [CUBE DROP PUZZLE](https://studyplaying.github.io/cube-drop-puzzle.html)
- [UNSCREW WOOD PUZZLE](https://quizverses-9d2f2.web.app/unscrew-wood-puzzle.html)
- [WE ARE IN A SIMULATION SIMULATOR](https://thequizzone.pages.dev/we-are-in-a-simulation-simulator.html)
- [GRANDMA WITH MACHINE GUN APOCALYPSIS](https://quizverses.github.io/grandma-with-machine-gun-apocalypsis.html)
- [ULTIMATE FLYING CAR 2](https://learnquester.pages.dev/ultimate-flying-car-2.html)
- [PUSH THE COLORS](https://quizverses.github.io/push-the-colors.html)
- [FALLLING JEWELS](https://quizverses.github.io/fallling-jewels.html)
- [SQUID SPRUNKI SLITHER GAME 2](https://thelearnquesters.pages.dev/squid-sprunki-slither-game-2.html)
- [NG FLOW LINES](https://studyquests.github.io/ng-flow-lines.html)
- [TILE CONNECT CLUB](https://studyquests.github.io/tile-connect-club.html)
- [CATEGORY ESCAPE 3](https://thelearnquesters.pages.dev/category-escape-3.html)
- [MAHJONG RIDDLES EGYPT](https://studyquests.github.io/mahjong-riddles-egypt.html)
- [SPACEBAR CLICKER](https://quizverses.github.io/spacebar-clicker.html)
- [GENFIRE](https://studyquests.github.io/genfire.html)
- [JIGSOLITAIRE](https://learnquester.pages.dev/jigsolitaire.html)
- [TUNG SAHUR BOTS CHASE ROOM](https://learnquester.pages.dev/tung-sahur-bots-chase-room.html)
- [AVATAR WORLD SECRETS](https://quizverses.github.io/avatar-world-secrets.html)
- [FLICK N BOUNCE](https://quizverses.github.io/flick-n-bounce.html)
- [ROBOCARPOLI](https://quizverses.github.io/robocarpoli.html)
- [SUPER RACING GT DRAG PRO](https://thelearnquesters.pages.dev/super-racing-gt-drag-pro.html)
- [PANDA KITCHEN IDLE TYCOON](https://quizverses.github.io/panda-kitchen-idle-tycoon.html)
- [BOUNCY BLOB RACE OBSTACLE COURSE](https://quizverses.github.io/bouncy-blob-race-obstacle-course.html)
- [DOGE MATCH](https://thequizzone.pages.dev/doge-match.html)
- [TILEMAN IO](https://studyquests.github.io/tileman-io.html)
- [TAILOR STYLIST FASHION DIARY](https://learnquester.pages.dev/tailor-stylist-fashion-diary.html)
- [CATEGORY MMO25](https://thequizzone.pages.dev/category-mmo25.html)
- [LOVIE CHICS COACHELLA FESTIVAL](https://quizverses.github.io/lovie-chics-coachella-festival.html)
- [JUST LUDO](https://studyquests.github.io/just-ludo.html)
- [SAFE MERGE](https://learnquester.pages.dev/safe-merge.html)
- [SUPER SOCCER NOGGINS](https://thelearnquesters.pages.dev/super-soccer-noggins.html)
- [FARM VS ZOMBIES](https://thelearnquesters.pages.dev/farm-vs-zombies.html)
- [FOREST TILES](https://studyquests.github.io/forest-tiles.html)
- [RESTAURANT SIMULATOR BURGERS PIZZA](https://quizverses.github.io/restaurant-simulator-burgers-pizza.html)
- [HELIX CRUSH](https://studyquests.github.io/helix-crush.html)
- [GRAVITY SPEED RUN](https://studyquests.github.io/gravity-speed-run.html)
- [TRUCKTOPOLIS COOKING CHAOS](https://learnquester.pages.dev/trucktopolis-cooking-chaos.html)
- [FROGIO](https://studyquests.github.io/frogio.html)
- [TURRET GUNNER](https://quizverses.github.io/turret-gunner.html)
- [TANK BATTLE WAR COMMANDER](https://learnquester.pages.dev/tank-battle-war-commander.html)
- [CATEGORY ADVENTURE 3](https://thelearnquesters.pages.dev/category-adventure-3.html)
- [MANYUNYA SAVING THE PRINCESS](https://quizverses.github.io/manyunya-saving-the-princess.html)
- [SUGAR POP LAND](https://thelearnquesters.pages.dev/sugar-pop-land.html)
- [LABUBA MERGE](https://quizverses.github.io/labuba-merge.html)
- [ZOMBIE DEFENSE WAR](https://studyquests.github.io/zombie-defense-war.html)
- [WORDMEISTER HD](https://learnquester.pages.dev/wordmeister-hd.html)
- [PANDA SHOP SIMULATOR](https://learnquester.pages.dev/panda-shop-simulator.html)
- [JIGSORT PUZZLES](https://thequizzone.pages.dev/jigsort-puzzles.html)
- [CATEGORY IO](https://learnquesters.pages.dev/category-io.html)
- [FISHING THE RUSSIAN WAY](https://studyquests.github.io/fishing-the-russian-way.html)
- [FARM TRIPLE MATCH](https://thequizzone.pages.dev/farm-triple-match.html)
- [PICK BRAINROT 3D BATTLE](https://learnquester.pages.dev/pick-brainrot-3d-battle.html)
- [LULUS FASHION WORLD](https://thelearnquesters.pages.dev/lulus-fashion-world.html)
- [ROBBIE BECOME A BEAST](https://studyquesthub.web.app/robbie-become-a-beast.html)
- [INDEX8](https://learnquesters.pages.dev/index8.html)
- [SLIDE THEM AWAY](https://studyquesthub.web.app/slide-them-away.html)
- [UNSCREW WOOD PUZZLE](https://learnquester.pages.dev/unscrew-wood-puzzle.html)
- [BEAT THE ZOMBIES](https://learnquester.pages.dev/beat-the-zombies.html)
- [EGGY BEATS](https://learnquester.pages.dev/eggy-beats.html)
- [PICTURE BY PIECES](https://thequizzone.pages.dev/picture-by-pieces.html)
- [GEOMETRY VIBES MONSTER](https://learnquester.pages.dev/geometry-vibes-monster.html)
- [TRAVEL WITH ME ASMR EDITION](https://quizverses.github.io/travel-with-me-asmr-edition.html)
- [PYRAMIDZ2](https://learnquester.pages.dev/pyramidz2.html)
- [WE WILL NOT SURVIVE](https://quizverses.github.io/we-will-not-survive.html)
- [CAPYBARA SCREW JAM](https://thelearnquesters.pages.dev/capybara-screw-jam.html)
- [CATEGORY GROW99](https://learnquesters.pages.dev/category-grow99.html)
- [STELLAR GUARDIAN](https://quizverses.github.io/stellar-guardian.html)
- [BLOCK BREAKER](https://thelearnquesters.pages.dev/block-breaker.html)
- [CATEGORY HORROR 2](https://thelearnquesters.pages.dev/category-horror-2.html)
- [100 DOORS PUZZLE BOX](https://quizverses.github.io/100-doors-puzzle-box.html)
- [ARROW PUZZLE](https://learnquester.pages.dev/arrow-puzzle.html)
- [CATEGORY STICKMAN](https://quizverses.github.io/category-stickman.html)
- [MAHJONG CONNECT COOKWARE](https://quizverses.github.io/mahjong-connect-cookware.html)
- [HALLOWEEN FRUIT SLICE](https://learnquester.pages.dev/halloween-fruit-slice.html)
- [CATEGORY MANAGEMENT210](https://quizverses.github.io/category-management210.html)
- [LUNAR PHASE BATTLE](https://learnquester.pages.dev/lunar-phase-battle.html)
- [UNLOCK THE BOLTS](https://studyquesthub.web.app/unlock-the-bolts.html)
- [SPA EMPIRE](https://studyquesthub.web.app/spa-empire.html)
- [CROSS CONNECT WORD](https://studyquests.github.io/cross-connect-word.html)
- [ANACONDA RUNNER](https://studyquests.github.io/anaconda-runner.html)
- [CATEGORY SIMULATION](https://studyquesthub.web.app/category-simulation.html)
- [CATEGORY CUTE](https://studyquesthub.web.app/category-cute.html)
- [COWBOYS DUEL](https://quizverses.github.io/cowboys-duel.html)
- [2048 CUBE MERGE](https://quizverses.github.io/2048-cube-merge.html)
- [CATEGORY CASUAL 6](https://learnquesters.pages.dev/category-casual-6.html)
- [BUILDING MODS FOR MINECRAFT](https://learnquester.pages.dev/building-mods-for-minecraft.html)
- [CATEGORY RPG](https://thelearnquesters.pages.dev/category-rpg.html)
- [PIN BOARD PUZZLE](https://learnquester.pages.dev/pin-board-puzzle.html)
- [DRIVE TO SURVIVE](https://studyquests.github.io/drive-to-survive.html)
- [WOOD NUTS MASTER SCREW PUZZLE](https://learnquester.pages.dev/wood-nuts-master-screw-puzzle.html)
- [DOGE MATCH](https://quizverses.github.io/doge-match.html)
- [BRAINROT MERGE DROP PUZZLES](https://studyquests.github.io/brainrot-merge-drop-puzzles.html)
- [NUMBER BUBBLE SHOOTER](https://learnquester.pages.dev/number-bubble-shooter.html)
- [CATEGORY LOGIC538](https://thelearnquesters.pages.dev/category-logic538.html)
- [CELEBRITIES GET READY FOR CHRISTMAS](https://learnquester.pages.dev/celebrities-get-ready-for-christmas.html)
- [TAPE SORT 3D](https://thequizzone.pages.dev/tape-sort-3d.html)
- [SEEK FIND](https://studyquests.github.io/seek-find.html)
- [CATEGORY CLASSIC97](https://quizverses.github.io/category-classic97.html)
- [POP THEM](https://quizverses.pages.dev/pop-them.html)
- [COLOR YARN SORT](https://quizverses.github.io/color-yarn-sort.html)
- [SORT GAME TOY SORT](https://thelearnquesters.pages.dev/sort-game-toy-sort.html)
- [OFFROAD LIFE 3D](https://quizverses.github.io/offroad-life-3d.html)
- [DISASSEMBLE THE PICTURE PUZZLE](https://quizverses.github.io/disassemble-the-picture-puzzle.html)
- [FIND HIDDEN SECRETS](https://thelearnquesters.pages.dev/find-hidden-secrets.html)
- [CATEGORY PHYSICS371](https://studyquesthub.web.app/category-physics371.html)
- [HOLIDAY HEX SORT](https://studyquests.github.io/holiday-hex-sort.html)
- [ELEMENTAL DRESSUP MAGIC](https://learnquester.pages.dev/elemental-dressup-magic.html)
- [MINE SWEEPER](https://learnquester.pages.dev/mine-sweeper.html)
- [CATEGORY PUZZLE 2](https://studyquesthub.web.app/category-puzzle-2.html)
- [ZOMBIE ROYALE IO](https://quizverses.github.io/zombie-royale-io.html)
- [COSMIC AVIATOR](https://learnquester.pages.dev/cosmic-aviator.html)
- [PRIVACY](https://thelearnquesters.pages.dev/privacy.html)
- [SQUIRREL WITH A GUN](https://studyquests.github.io/squirrel-with-a-gun.html)
- [ZINDEX](https://learnquester.pages.dev/zindex.html)
- [DRIVE RACE CRASH](https://quizverses.github.io/drive-race-crash.html)
- [FRUIT MERGE JUICY DROP GAME](https://quizverses.github.io/fruit-merge-juicy-drop-game.html)
- [CATEGORY LOGIC538](https://learnquesters.pages.dev/category-logic538.html)
- [PEOPLE PLAYGROUND 3D](https://learnquester.pages.dev/people-playground-3d.html)
- [CATEGORY CONTROLLER59](https://studyquests.github.io/category-controller59.html)
- [CATEGORY SOCCER 2](https://thelearnquesters.pages.dev/category-soccer-2.html)
- [CAPYBARA SUIKA](https://quizverses.pages.dev/capybara-suika.html)
- [CATEGORY CASUAL](https://learnquesters.pages.dev/category-casual.html)
- [SPACEIO](https://quizverses.github.io/spaceio.html)
- [CATEGORY SNAKE GAMES](https://quizverses.github.io/category-snake-games.html)
- [PAPERLY PAPER PLANE ADVENTURE](https://thequizzone.pages.dev/paperly-paper-plane-adventure.html)
- [CHICKEN SCREAM RACE](https://quizverses.pages.dev/chicken-scream-race.html)
- [DRIVE RACE CRASH](https://learnquester.pages.dev/drive-race-crash.html)
- [WORLD SOCCER](https://studyquests.github.io/world-soccer.html)
- [GT CHAMPIONSHIP ARCADE](https://studyquests.github.io/gt-championship-arcade.html)
- [MERGE BALLS NEW YEARS TOYS IN 3D](https://quizverses.github.io/merge-balls-new-years-toys-in-3d.html)

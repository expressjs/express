[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](https://expressjs.com/)

**Fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org).**

**This project has a [Code of Conduct].**

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣷⢸⣿⣿⡜⢯⣷⡌⡻⣿⣿⣿⣆⢈⠻⠿⢿⣿⣿⣿⣿⣿⣿⣷⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡁⢳⣿⣿⣿⣿⣿⣿⡜⣿⣿⣧⢀⢻⣷⠰⠈⢿⣿⣿⣧⢣⠉⠑⠪⢙⠿⠿⠿⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣱⡇⡞⣿⣿⣿⣿⣿⣿⡇⣿⣿⡏⡄⣧⠹⡇⠧⠈⢻⣿⣿⡇⢧⢢⠀⠀⠑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣇⢃⢿⣿⣿⣿⣿⣿⣷⣿⣿⠇⢃⣡⣤⡹⠐⣿⣀⢻⣿⣿⢸⡎⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣾⣿⣿⠘⡸⣿⣿⣿⣿⣿⣿⣿⡿⣰⣿⣿⢟⡷⠈⠋⠃⠎⢿⣿⡏⣿⠀⠘⢆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡐⢹⣿⣿⡐⢡⢹⣿⣿⣿⣿⡏⣿⢣⣿⣿⡑⠁⠔⠀⠉⠉⠢⡘⣿⡇⣿⡇⠀⡀⠡⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠘⣿⣿⣇⠇⢣⢻⣿⣿⣿⡇⢇⣾⣿⣿⡆⢸⣤⡀⠚⢂⠀⢡⢿⡇⣿⡇⠀⢿⠀⠀⠄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠠⠹⣿⣿⡘⣆⢣⠻⣿⣿⢈⣾⣿⣿⣿⣶⣸⣏⢀⣬⣋⡼⣠⢸⢹⣿⡇⢠⣼⠙⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡇⠁⠹⣿⣇⠹⡃⠃⠙⡇⠘⢿⣿⣿⣿⣿⣿⣏⣓⣉⣭⣴⣿⠘⢸⣿⠁⠘⠋⠀⠹⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⠀⠀⠈⢿⣇⠂⣷⠄⠐⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢠⢸⡏⠀⢀⣠⣴⣾⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⠀⠙⠆⠈⠢⠲⠥⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡞⣸⠁⠀⢸⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠄⠃⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⡏⠹⣿⣿⡿⠫⠊⠀⠀⠀⣶⠀⢻⣿⣿⣿⣿⡿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠻⠿⠿⠿⢋⠀⠀⠀⠀⢀⣼⣿⡆⠈⣿⣿⣿⡟⣱⡷⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢁⣁⡀⠨⣛⠿⠶⠄⢀⣠⣾⣿⣿⣷⠀⢹⣿⡟⣴⠈⢃⣶⠔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⡄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠈⣿⣿⡿⠀⡀⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢙⠻⣿⣿⢀⠙⠻⠿⣿⣿⣿⣿⣿⣿⡇⠁⣿⠟⡀⠈⣧⢰⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⠴⠮⣥⠻⢧⣤⣄⣀⡉⢩⣭⣍⣃⣀⣩⠎⢀⣼⠉⣼⡯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠁⣛⠓⢒⣒⣢⡭⢁⡈⠿⠿⠟⠹⠛⠁⠀⠀⠀⠰⠃⠂⠀⠀⠀

蜜蜂電影劇本 根據已知的航空定律，蜜蜂根本不可能飛。它的翅膀太小，肥胖的小身體無法離開地面。當然，蜜蜂還是會飛，因為蜜蜂不在乎人類認為不可能的事。黃色，黑色。黃色，黑色。黃色，黑色。黃色，黑色。哦，黑色和黃色！讓我們稍微改變一下。巴里！早餐好了！嗚嗚嗚！等一下。餵？ - 巴里？ - 亞當？ - 你相信這是真的嗎？ - 我不信。我去接你。看起來精神抖擻。走樓梯。你爸爸花了很多錢買的。對不起。我很興奮。畢業生來了。兒子，我們為你感到驕傲。完美的成績單，全是 B。非常自豪。媽！我有點事情要做。 - 你的絨毛上有棉絮。 - 哎喲！那是我！ - 向我們揮手！我們坐在 118,000 排。 - 再見！巴里，我告訴過你，別在屋子裡飛！ - 嘿，亞當。 - 嘿，巴里。 - 那是絨毛啫咖哩嗎？ - 一點點。特殊的日子，畢業典禮。從沒想過我會參加。三天小學，三天高中。那段時間很尷尬。三天大學。我很高興我花了一天時間搭便車繞著蜂巢轉了一圈。你回來時確實不一樣了。 - 嗨，巴里。 - 阿蒂，留鬍子了？看起來不錯。 - 聽過法蘭基的事嗎？ - 是的。 - 你要去參加葬禮嗎？ - 不，我不去。大家都知道，蟄人，你會死。別把它浪費在松鼠身上。真是個急性子。我想他本來可以走開的。我喜歡把遊樂園融入我們的日常生活中。這就是為什麼我們不需要假期。天哪，在這種情況下……真是有點排場。 - 好吧，亞當，今天我們是男人了。 - 我們是！ - 蜜蜂男人。 - 阿門！哈利路亞！同學、老師、傑出的蜜蜂們，歡迎 Buzzwell 院長。歡迎新蜂巢 Oity 畢業班…9:15。我們的畢業典禮到此結束。你們在 Honex Industries 的職業生涯就此開始！我們今天會選工作嗎？我聽說只是迎新活動。注意！開始了。請務必將你們的手和觸角放在車廂內。 - 想知道會是什麼樣子嗎？ - 有點嚇人。歡迎來到 Honex，Honesco 的一個部門，也是 Hexagon 集團的一部分。就是這裡！哇。哇。我們知道，身為一隻蜜蜂，你們辛勤工作了一輩子，才達到可以終生工作的地步。當我們英勇的花粉運動員將花蜜帶回蜂巢時，蜂蜜就開始了。我們的絕密配方會自動校正顏色、調整氣味和塑造氣泡，使其成為這種舒緩的甜糖漿，散發出獨特的金色光澤，你們知道它就是…蜂蜜！ - 那個女孩很性感。 - 她是我表妹！ - 她是嗎？ - 是的，我們都是表妹。 - 對。你說得對。 - 在 Honex，我們不斷努力改善蜜蜂生存的各個層面。這些蜜蜂正在對一種新的頭盔技術進行壓力測試。 - 你覺得他做了什麼？ - 不夠。這是我們最新的進展，Krelman。 - 這是做什麼的？ - 燕麥片，用來捕捉倒蜂蜜後掛在上面的那小串蜂蜜。為我們節省了數百萬美元。有人研究過 Krelman 嗎？當然。大多數蜜蜂的工作都很小。但蜜蜂知道，每一份小工作，如果做得好，都意義重大。但要謹慎選擇，因為你將終身從事你選擇的工作。一輩子做同樣的工作？我不知道這一點。有什麼區別？你會很高興知道，蜜蜂作為一個物種，2700 萬年來沒有休息過一天。所以你要讓我們累死？我們一定會努力的。哇！這真是讓我大吃一驚！ 「有什麼區別？」你怎麼能這麼說？一輩子只做一份工作？這真是個瘋狂的選擇。我鬆了一口氣。現在我們一生中只需要做一個決定。但是，亞當，他們怎麼可能從來沒告訴過我們呢？為什麼要質疑任何事？我們是蜜蜂。我們是地球上運作最完美的社會。你有沒有想過，這裡的事情可能運作得太好了？比如什麼？舉個例子。我不知道。但你知道我在說什麼。請清門。皇家花蜜部隊正在接近。等一下。看看吧。 - 嘿，那些是花粉運動員！ - 哇。我從來沒這麼近地看過它們。它們知道蜂巢外面是什麼樣子。是的，但有些一去不復返了。 - 嘿，運動員！ - 嗨，運動員！你們做得太棒了！你們是怪物！你們是天空怪胎！我喜歡它！我喜歡它！ - 我想知道它們在哪裡。 - 我不知道。他們的一天沒有計劃。在蜂巢外面，飛到誰知道的地方，做誰知道的事。你不能只是決定成為花粉運動員。你得為此而生。對。你看。這比你我一輩子看到的花粉還要多。這只是一個身份的象徵。蜜蜂製造了太多的花粉。也許吧。除非你戴著它，女士們看到你戴著它。那些女士們？她們不也是我們的表親嗎？遙遠的。遙遠的。看看這兩個。 - 一對蜂巢哈利。 - 讓我們和他們一起玩吧。當花粉運動員一定很危險。是啊。有一次，一隻熊把我壓在蘑菇上！他用一隻爪子抓住我的喉嚨，用另一隻爪子打我！ - 哦，我的天哪！ - 我從沒想過我會把他打昏。當時在做什麼？試圖通知當局。我可以簽名

## Table of contents

- [Table of contents](#table-of-contents)
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
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

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

### Security Issues

If you discover a security vulnerability in Express, please see [Security Policies and Procedures](SECURITY.md).

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
* [dpopp07](https://github.com/dpopp07) - **Dustin Popp**
* [UlisesGascon](https://github.com/UlisesGascon) - **Ulises Gascón** (he/him)
* [3imed-jaberi](https://github.com/3imed-jaberi) - **Imed Jaberi**
* [IamLizu](https://github.com/IamLizu) - **S M Mahmudul Hasan** (he/him)
* [Phillip9587](https://github.com/Phillip9587) - **Phillip Barta**
* [Sushmeet](https://github.com/Sushmeet) - **Sushmeet Sunger**
* [rxmarbles](https://github.com/rxmarbles) **Rick Markins** (He/him)

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
  * [import-brain](https://github.com/import-brain) - **Eric Cheng** (he/him)
  * [dakshkhetan](https://github.com/dakshkhetan) - **Daksh Khetan** (he/him)
  * [lucasraziel](https://github.com/lucasraziel) - **Lucas Soares Do Rego**
  * [mertcanaltin](https://github.com/mertcanaltin) - **Mert Can Altin**

</details>


## License

  [MIT](LICENSE)

[coveralls-image]: https://badgen.net/coveralls/c/github/expressjs/express/master
[coveralls-url]: https://coveralls.io/r/expressjs/express?branch=master
[github-actions-ci-image]: https://badgen.net/github/checks/expressjs/express/master?label=CI
[github-actions-ci-url]: https://github.com/expressjs/express/actions/workflows/ci.yml
[npm-downloads-image]: https://badgen.net/npm/dm/express
[npm-downloads-url]: https://npmcharts.com/compare/express?minimal=true
[npm-url]: https://npmjs.org/package/express
[npm-version-image]: https://badgen.net/npm/v/express
[ossf-scorecard-badge]: https://api.scorecard.dev/projects/github.com/expressjs/express/badge
[ossf-scorecard-visualizer]: https://ossf.github.io/scorecard-visualizer/#/projects/github.com/expressjs/express
[Code of Conduct]: https://github.com/expressjs/.github/blob/HEAD/CODE_OF_CONDUCT.md
[Contributing Guide]: https://github.com/expressjs/.github/blob/HEAD/CONTRIBUTING.md

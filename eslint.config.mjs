import globals from 'globals'
import neostandard from 'neostandard'

// globals present in Node.js but not in browsers.
const nodeGlobals = Object.keys(globals.node).filter(g => !Object.keys(globals.browser).includes(g))

// Node.js-specific globals that are allowed.
const allowedGlobals = [
  'require', 'module', 'exports', '__dirname', 'process', 'setImmediate'
]

export default [
  ...neostandard({
    env: ['mocha']
  }),
  {
    rules: {
      'global-require': 'warn',
      'no-restricted-globals': ['error', ...nodeGlobals.filter(g => !allowedGlobals.includes(g))],
      'n/handle-callback-err': 'off'
    }
  }
]

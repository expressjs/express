import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['mocha']
  }),
  {
    rules: {
      'global-require': 'warn',
      'no-restricted-globals': ['error', {
        name: 'Buffer',
        message: 'Use `import { Buffer } from "node:buffer"` instead of the global Buffer.',
      }],
      'n/handle-callback-err': 'off'
    }
  }
]

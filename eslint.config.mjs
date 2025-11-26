import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['mocha', 'node']
  }),
  {
    rules: {
      'global-require': 'warn',
      'n/handle-callback-err': 'off'
    }
  }
]

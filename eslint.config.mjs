export default [
  {
    // Define language options
    languageOptions: {
      sourceType: 'module', // or 'commonjs' based on your project
      globals: {
        // Add any global variables you need
        __dirname: true,
        process: true,
      },
    },
    rules: {
      'eol-last': 'error',
      'eqeqeq': ['error', 'allow-null'],
      'indent': ['error', 2, { MemberExpression: 'off', SwitchCase: 1 }],
      'no-trailing-spaces': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
        }
      ],
    },
  },
];

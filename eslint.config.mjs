import globals from "globals";

export default [{
  ignores: ["**/coverage", "**/node_modules"],
}, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },

  rules: {
    "eol-last": "error",
    eqeqeq: ["error", "allow-null"],

    indent: ["error", 2, {
      MemberExpression: "off",
      SwitchCase: 1,
    }],

    "no-trailing-spaces": "error",

    "no-unused-vars": ["error", {
      vars: "all",
      args: "none",
      caughtErrors: "none",
      ignoreRestSiblings: true,
    }],

    "no-restricted-globals": ["error", {
      name: "Buffer",
      message: "Use `import { Buffer } from \"node:buffer\"` instead of the global Buffer.",
    }],
  },
}];

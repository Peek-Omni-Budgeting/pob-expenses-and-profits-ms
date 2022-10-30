module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "arca",
    "eslint-plugin-import",
    "@typescript-eslint",
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "no-console": 0,
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 1,
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "MemberExpression": 1,
        ImportDeclaration: "first"
      }
    ],
    "ban-ts-ignore": 0,
    "arca/import-align": 2,
    "template-curly-spacing": ["error", "always"]
  }
}

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 2,
    'indent': [2, 2],
    'vue/attribute-hyphenation': [2, 'never', { 'ignore': ['custom-prop'] }],
    'vue/valid-v-on': 0,
    'vue/name-property-casing': [2, 'PascalCase'],
    'vue/no-confusing-v-for-v-if': 0,
    'vue/require-prop-types': 0
  }
}

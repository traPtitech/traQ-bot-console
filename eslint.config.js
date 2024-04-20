const pluginVue = require('eslint-plugin-vue')

module.exports = [
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        node: true,
        es2022: true
      }
    },
    files: [
      "src/**/*.js",
      "src/**/*.vue"
    ],
    rules: {
      "vue/custom-event-name-casing": "error",
      "vue/multi-word-component-names": "off",
    }
  }
]

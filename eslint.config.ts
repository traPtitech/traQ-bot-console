import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        node: true,
        es2022: true
      }
    },
    files: [
      "src/**/*.ts"
    ],
    rules: {
      "vue/custom-event-name-casing": "error",
      "vue/multi-word-component-names": "off",
    }
  },
  {
    languageOptions: {
      parserOptions: {
        parser: tsParser
      },
      globals: {
        node: true,
        es2022: true
      }
    },
    files: [
      "src/**/*.vue"
    ],
    rules: {
      "vue/custom-event-name-casing": "error",
      "vue/multi-word-component-names": "off",
    }
  }
]

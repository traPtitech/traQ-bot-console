import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'

const commonRules = {
  'vue/custom-event-name-casing': 'error',
  'vue/multi-word-component-names': 'off',
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-check': false,
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
      minimumDescriptionLength: 3,
    },
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      fixStyle: 'separate-type-imports',
      prefer: 'type-imports',
    },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
      varsIgnorePattern: '^_',
    },
  ],
}

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        node: true,
        es2022: true,
      },
    },
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...commonRules,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
      globals: {
        node: true,
        es2022: true,
      },
    },
    files: ['src/**/*.vue'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...commonRules,
    },
  },
  {
    files: [
      'src/components/**/*.{ts,vue}',
      'src/views/Home.vue',
      'src/api.ts',
      'src/utils.ts',
      'src/permissions.ts',
      'src/router/**/*.ts',
      'src/store/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]

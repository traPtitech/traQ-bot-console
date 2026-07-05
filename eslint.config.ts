import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const config = defineConfig([
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,vue}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
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
    },
  },
  {
    languageOptions: {
      parser: tseslint.parser,
    },
    files: ['src/**/*.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    files: ['src/**/*.vue'],
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
])

export default config

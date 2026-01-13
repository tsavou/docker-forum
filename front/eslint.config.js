import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import prettier from '@vue/eslint-config-prettier';

export default [
  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],

  prettier,

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },

  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.log',
      '.DS_Store',
      'coverage/**',
      'playwright.config.js',
      'vitest.config.js',
    ],
  },
];

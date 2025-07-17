import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  { ignores: ['**/dist/**', '**/*.d.ts'] },
  js.configs.recommended,
  {
    files: ['backend/**/*.ts', 'shared/**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./backend/tsconfig.json', './shared/tsconfig.json'],
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^',
          varsIgnorePattern: '^',
          caughtErrorsIgnorePattern: '^',
          ignoreRestSiblings: true,
          args: 'after-used',
        },
      ],
    },
  },
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./frontend/tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^',
          varsIgnorePattern: '^',
          caughtErrorsIgnorePattern: '^',
          ignoreRestSiblings: true,
          args: 'none',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

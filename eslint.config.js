import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/lib/**',
      '**/node_modules/**',
      '**/style/**',
      '**/*.d.ts',
      '.github/**',
      'assets/**',
      'binder/**',
      'docs/**',
      'examples/**',
      'scripts/**',
      'eslint.config.js'
    ]
  },
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.eslint.json',
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true
          }
        }
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      curly: ['error', 'all'],
      eqeqeq: 'error',
      'prefer-arrow-callback': 'error'
    }
  }
);

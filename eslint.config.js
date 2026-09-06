// ESLint flat config (ESLint 9+ dropped .eslintrc).
//
// The rule set stays deliberately narrow: eslint:recommended plus a handful of
// correctness rules. This is a legacy jQuery codebase and a formatting-heavy
// config would bury real findings under thousands of cosmetic ones.
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    // Build output, dependencies, and vendored third-party plugins. The latter
    // are kept byte-identical to upstream so they can be re-synced.
    ignores: [
      'node_modules/**',
      'src/dist/**',
      'src/lib/js/plugins/**'
    ]
  },

  js.configs.recommended,

  {
    // First-party browser behaviour modules.
    files: ['src/lib/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        UIKNavigation: 'readonly',
        UIKTables: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'eqeqeq': ['warn', 'smart'],
      'no-shadow': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'curly': ['warn', 'all'],
      'semi': ['warn', 'always'],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },

  {
    // The webpack entry point is CommonJS.
    files: ['src/lib/js/uik.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.browser, ...globals.jquery, ...globals.commonjs }
    }
  },

  {
    // QUnit specs.
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
        QUnit: 'readonly',
        sinon: 'readonly',
        UIKTest: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'semi': ['warn', 'always']
    }
  },

  {
    // Node-side tooling.
    files: ['karma.conf.js', 'webpack.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node }
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
      'semi': ['warn', 'always']
    }
  }
];

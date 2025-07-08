import baseConfig from '../eslint.config.js'

export default [
  ...baseConfig,
  {
    // gcn-website specific configurations
    rules: {
      // Prettier integration specific to this project
      'prettier/prettier': [
        'error',
        {
          printWidth: 140,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          jsxSingleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          endOfLine: 'auto',
          overrides: [{ files: '*.json', options: { printWidth: 200 } }],
        },
      ],
      // Import rules specific to airbnb-base
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, minProperties: 3 },
          ObjectPattern: { multiline: true },
          ImportDeclaration: 'never',
          ExportDeclaration: { multiline: true, minProperties: 4 },
        },
      ],
      'import/no-absolute-path': 'off',
      'import/order': 'off',
      'import/extensions': 'off',
      'linebreak-style': ['error', 'windows'],
      'max-len': [
        'error',
        {
          ignoreStrings: true,
          ignoreUrls: true,
          code: 140,
        },
      ],
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.ts', '.js', '.json', '.vue'],
        },
      },
    },
    languageOptions: {
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      },
    },
  },
]

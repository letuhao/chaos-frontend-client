module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code quality
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    
    // Style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'space-infix-ops': 'error',
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    
    // Best practices
    'eqeqeq': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    
    // Unity WebGL specific
    'no-global-assign': 'off', // Unity creates global variables
    'no-implicit-globals': 'off' // Unity WebGL uses global scope
  },
  globals: {
    // Unity WebGL globals
    'UnityLoader': 'readonly',
    'unityInstance': 'readonly',
    'UnityToHTML': 'readonly',
    
    // Browser globals
    'window': 'readonly',
    'document': 'readonly',
    'navigator': 'readonly',
    'console': 'readonly',
    'setTimeout': 'readonly',
    'setInterval': 'readonly',
    'clearTimeout': 'readonly',
    'clearInterval': 'readonly',
    'fetch': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'caches': 'readonly',
    'serviceWorker': 'readonly',
    
    // Game globals
    'gameUI': 'writable'
  }
};

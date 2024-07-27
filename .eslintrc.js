// eslint-disable-next-line @typescript-eslint/no-var-requires
const stylistic = require('@stylistic/eslint-plugin');

const customStyle = stylistic.configs.customize({
    arrowParens: true,
    blockSpacing: true,
    braceStyle: 'stroustrup',
    commaDangle: 'always-multiline',
    indent: 4,
    jsx: false,
    quoteProps: 'consistent-as-needed',
    semi: true,
});

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', '@stylistic'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'curly': 'error',
        'eqeqeq': 'error',
        'no-throw-literal': 'error',
        ...customStyle.rules,
        '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
        '@stylistic/wrap-iife': ['error', 'inside', { functionPrototypeMethods: true }],
    },
    ignorePatterns: ['out', 'dist', '**/*.d.ts'],
};

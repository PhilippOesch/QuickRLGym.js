/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['./dist'],
    collectCoverageFrom: [
        '**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    coverageDirectory: './coverage',
};

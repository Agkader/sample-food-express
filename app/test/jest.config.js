module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'routes/**/*.js',
        '!**/node_modules/**'
    ],
    testTimeout: 10000
};
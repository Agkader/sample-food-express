// Mock database for all tests
jest.mock('../config/db.config.js', () => ({}));

// Set test environment variables
process.env.TOKEN_SECRET = 'test-secret-key-for-jwt';
process.env.NODE_ENV = 'test';
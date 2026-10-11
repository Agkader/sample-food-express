// Mock database BEFORE any imports
jest.mock('../config/db.config.js', () => ({}));

const supertest = require('supertest');
const { app, index } = require('../index');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Mock bcryptjs (not bcrypt!)
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn()
}));

const bcrypt = require('bcryptjs');

jest.mock('../models/user.model');

const generateToken = (userId, isAdmin = false) => {
    return jwt.sign(
        { id: userId.toString(), isAdmin: isAdmin },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

describe('User Routes', () => {
    
    afterAll(async () => {
        jest.clearAllMocks();
        if (index && index.close) {
            await new Promise((resolve) => {
                index.close(() => resolve());
            });
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    //  REGISTRATION TESTS 
    describe('POST /api/user/register - User Registration', () => {
        
        it('should register a new user with valid data', async () => {
            const newUser = {
                email: 'newuser@example.com',
                username: 'newuser',
                password: 'Password123!'
            };

            User.findOne = jest.fn().mockResolvedValue(null);
            
            const mockSavedUser = {
                _id: '507f1f77bcf86cd799439011',
                email: newUser.email,
                username: newUser.username,
                isAdmin: false
            };
            
            User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);

            const res = await supertest(app)
                .post('/api/user/register')
                .send(newUser);

            expect(res.status).toBe(201);
            expect(res.body.email).toBe(newUser.email);
            expect(res.body.password).toBeUndefined();
        });

        it('should reject registration with existing email', async () => {
            const existingUser = {
                email: 'existing@example.com',
                username: 'existinguser',
                password: 'Password123!'
            };

            User.findOne = jest.fn().mockResolvedValue({
                _id: '1',
                email: existingUser.email
            });

            const res = await supertest(app)
                .post('/api/user/register')
                .send(existingUser);

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it('should reject registration with invalid email format', async () => {
            const invalidUser = {
                email: 'invalid-email',
                username: 'testuser',
                password: 'Password123!'
            };

            const res = await supertest(app)
                .post('/api/user/register')
                .send(invalidUser);

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it('should reject registration with short password', async () => {
            const weakPasswordUser = {
                email: 'test@example.com',
                username: 'testuser',
                password: '123'
            };

            const res = await supertest(app)
                .post('/api/user/register')
                .send(weakPasswordUser);

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });
    });
 
    // LOGIN TESTS 
    describe('POST /api/user/login - User Login', () => {
        
        it('should login with valid credentials', async () => {
            const loginData = {
                email: 'user@example.com',
                password: 'Password123!'
            };

            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                email: loginData.email,
                password: 'hashed_password',
                username: 'testuser',
                isAdmin: false
            };

            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // ← Fixed

            const res = await supertest(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });

        it('should reject login with wrong password', async () => {
            const loginData = {
                email: 'user@example.com',
                password: 'WrongPassword123!'
            };

            const mockUser = {
                _id: '1',
                email: loginData.email,
                password: 'hashed_password'
            };

            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // ← Fixed

            const res = await supertest(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it('should reject login with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'Password123!'
            };

            User.findOne = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .post('/api/user/login')
                .send(loginData);

            expect(res.status).toBe(400);
            expect(res.body.error).toBeDefined();
        });

        it('should reject login with missing credentials', async () => {
            const res = await supertest(app)
                .post('/api/user/login')
                .send({ email: 'test@example.com' });

            expect(res.status).toBe(400);
        });
    });
});
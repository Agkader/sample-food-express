// Mock database BEFORE any imports
jest.mock('../config/db.config.js', () => ({}));

const supertest = require('supertest');
const { app, index } = require('../index');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/user.model');


// Mock bcryptjs (not bcrypt!)
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn()
}));


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
    // GET USER BY ID TESTS 
    describe('GET /api/user/:id - Get User by ID', () => {
        
        it('should allow user to get their own details', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            const mockUser = {
                _id: userId,
                email: 'user@example.com',
                username: 'testuser',
                isAdmin: false
            };

            // Mock with select chain
            User.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await supertest(app)
                .get(`/api/user/${userId}`)
                .set('auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe(mockUser.username);
            expect(res.body.password).toBeUndefined();
        });

        it('should deny user from viewing other users details', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const otherUserId = '507f1f77bcf86cd799439012';
            const token = generateToken(userId, false);

            const res = await supertest(app)
                .get(`/api/user/${otherUserId}`)
                .set('auth-token', token);

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('Access Denied');
        });

        it('should allow admin to view any user details', async () => {
            const adminId = '507f1f77bcf86cd799439999';
            const targetUserId = '507f1f77bcf86cd799439011';
            const adminToken = generateToken(adminId, true);

            const mockUser = {
                _id: targetUserId,
                email: 'user@example.com',
                username: 'testuser',
                isAdmin: false
            };

            // Mock with select chain
            User.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const res = await supertest(app)
                .get(`/api/user/${targetUserId}`)
                .set('auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe(mockUser.username);
        });

        it('should reject request without token', async () => {
            const res = await supertest(app)
                .get('/api/user/507f1f77bcf86cd799439011');

            expect(res.status).toBe(401);
            expect(res.body.error).toContain('Access Denied');
        });

        it('should reject request with invalid token', async () => {
            const res = await supertest(app)
                .get('/api/user/507f1f77bcf86cd799439011')
                .set('auth-token', 'invalid_token');

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Invalid Token');
        });

        it('should return 404 if user not found', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            // Mock with select chain returning null
            User.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const res = await supertest(app)
                .get(`/api/user/${userId}`)
                .set('auth-token', token);

            expect(res.status).toBe(404);
        });
    });

    //  UPDATE USER TESTS 
    describe('PUT /api/user/:id - Update User', () => {
        
        it('should allow user to update their own account', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            const updateData = {
                username: 'updatedusername',
                email: 'updated@example.com'
            };

            const updatedUser = {
                _id: userId,
                ...updateData,
                isAdmin: false
            };

            // Mock with select chain
            User.findByIdAndUpdate = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser)
            });

            const res = await supertest(app)
                .put(`/api/user/${userId}`)
                .set('auth-token', token)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe(updateData.username);
            expect(User.findByIdAndUpdate).toHaveBeenCalled();
        });

        it('should allow admin to update any user', async () => {
            const adminId = '507f1f77bcf86cd799439999';
            const targetUserId = '507f1f77bcf86cd799439011';
            const adminToken = generateToken(adminId, true);

            const updateData = { username: 'adminupdated' };
            const updatedUser = {
                _id: targetUserId,
                ...updateData
            };

            // Mock with select chain
            User.findByIdAndUpdate = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedUser)
            });

            const res = await supertest(app)
                .put(`/api/user/${targetUserId}`)
                .set('auth-token', adminToken)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.username).toBe(updateData.username);
        });

        it('should deny user from updating other users', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const otherUserId = '507f1f77bcf86cd799439012';
            const token = generateToken(userId, false);

            const res = await supertest(app)
                .put(`/api/user/${otherUserId}`)
                .set('auth-token', token)
                .send({ username: 'hacked' });

            expect(res.status).toBe(403);
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('should hash password if updated', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            const updateData = {
                password: 'NewPassword123!'
            };

            // Mock with select chain
            User.findByIdAndUpdate = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    _id: userId,
                    username: 'testuser'
                })
            });

            const res = await supertest(app)
                .put(`/api/user/${userId}`)
                .set('auth-token', token)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(res.body.password).toBeUndefined();
        });

        it('should reject update without authentication', async () => {
            const res = await supertest(app)
                .put('/api/user/507f1f77bcf86cd799439011')
                .send({ username: 'test' });

            expect(res.status).toBe(401);
        });

        it('should validate email format on update', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            const res = await supertest(app)
                .put(`/api/user/${userId}`)
                .set('auth-token', token)
                .send({ email: 'invalid-email' });

            expect(res.status).toBe(400);
        });
    });

    // ==================== DELETE USER TESTS ====================
    describe('DELETE /api/user/:id - Delete User', () => {
        
        it('should allow user to delete their own account', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            User.findByIdAndDelete = jest.fn().mockResolvedValue({
                _id: userId,
                username: 'deleteduser'
            });

            const res = await supertest(app)
                .delete(`/api/user/${userId}`)
                .set('auth-token', token);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
        });

        it('should allow admin to delete any user', async () => {
            const adminId = '507f1f77bcf86cd799439999';
            const targetUserId = '507f1f77bcf86cd799439011';
            const adminToken = generateToken(adminId, true);

            User.findByIdAndDelete = jest.fn().mockResolvedValue({
                _id: targetUserId
            });

            const res = await supertest(app)
                .delete(`/api/user/${targetUserId}`)
                .set('auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(User.findByIdAndDelete).toHaveBeenCalledWith(targetUserId);
        });

        it('should deny user from deleting other users', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const otherUserId = '507f1f77bcf86cd799439012';
            const token = generateToken(userId, false);

            const res = await supertest(app)
                .delete(`/api/user/${otherUserId}`)
                .set('auth-token', token);

            expect(res.status).toBe(403);
            expect(User.findByIdAndDelete).not.toHaveBeenCalled();
        });

        it('should reject deletion without authentication', async () => {
            const res = await supertest(app)
                .delete('/api/user/507f1f77bcf86cd799439011');

            expect(res.status).toBe(401);
        });

        it('should return 404 if user to delete not found', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const token = generateToken(userId, false);

            User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .delete(`/api/user/${userId}`)
                .set('auth-token', token);

            expect(res.status).toBe(404);
        });
    });

    //  GET ALL USERS TESTS (ADMIN ONLY) 
    describe('GET /api/user - Get All Users (Admin Only)', () => {
        
        it('should allow admin to get all users', async () => {
            const adminId = '507f1f77bcf86cd799439999';
            const adminToken = generateToken(adminId, true);

            const mockUsers = [
                { _id: '1', username: 'user1', email: 'user1@example.com' },
                { _id: '2', username: 'user2', email: 'user2@example.com' }
            ];

            User.find = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            const res = await supertest(app)
                .get('/api/user')
                .set('auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].username).toBe('user1');
        });

        it('should deny regular user from getting all users', async () => {
            const userId = '507f1f77bcf86cd799439011';
            const userToken = generateToken(userId, false);

            const res = await supertest(app)
                .get('/api/user')
                .set('auth-token', userToken);

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('not allowed');
        });

        it('should reject request without authentication', async () => {
            const res = await supertest(app)
                .get('/api/user');

            expect(res.status).toBe(401);
        });

    });
});
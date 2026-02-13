// Mock database BEFORE any imports
jest.mock('../config/db.config.js', () => ({}));

const supertest = require('supertest');
const { app, index } = require('../index');
const Restaurant = require('../models/restaurant.model');
const jwt = require('jsonwebtoken');

jest.mock('../models/restaurant.model');

const generateToken = (userId, isAdmin = false) => {
    return jwt.sign(
        { id: userId.toString(), isAdmin: isAdmin },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

describe('Restaurant Routes', () => {
    
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

    //GET ALL RESTAURANTS
    describe('GET /api/restaurants - Get All Restaurants', () => {
        
        it('should get all restaurants without authentication', async () => {
            const mockRestaurants = [
                {
                    _id: '1',
                    name: 'Pizza Palace',
                    address: '123 Main St',
                    phone: '555-0001',
                    opening_hours: '9AM-9PM'
                },
                {
                    _id: '2',
                    name: 'Burger House',
                    address: '456 Oak Ave',
                    phone: '555-0002',
                    opening_hours: '10AM-10PM'
                }
            ];

            Restaurant.find = jest.fn().mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue(mockRestaurants)
                    })
                })
            });

            Restaurant.countDocuments = jest.fn().mockResolvedValue(2);

            const res = await supertest(app)
                .get('/api/restaurants');

            expect(res.status).toBe(200);
            expect(res.body.restaurants).toHaveLength(2);
            expect(res.body.restaurants[0].name).toBe('Pizza Palace');
            expect(res.body.page).toBe(1);
            expect(res.body.limit).toBe(10);
            expect(res.body.total).toBe(2);
        });

        
    });

    //  GET RESTAURANT BY ID 
    describe('GET /api/restaurants/:id - Get Restaurant by ID', () => {
        
        it('should get a restaurant by id ', async () => {
            const mockRestaurant = {
                _id: '507f1f77bcf86cd799439011',
                name: 'Sushi Bar',
                address: '789 Pine St',
                phone: '555-0003',
                opening_hours: '11AM-11PM'
            };

            Restaurant.findById = jest.fn().mockResolvedValue(mockRestaurant);

            const res = await supertest(app)
                .get('/api/restaurants/507f1f77bcf86cd799439011');

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Sushi Bar');
            expect(res.body.address).toBe('789 Pine St');
        });

        it('should return 404 if restaurant not found', async () => {
            Restaurant.findById = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .get('/api/restaurants/507f1f77bcf86cd799439011');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Restaurant not found');
        });
    });

    //CREATE RESTAURANT 
    describe('POST /api/restaurants - Create Restaurant', () => {
        
     it('should allow admin to create a restaurant', async () => {
       const adminToken = generateToken('999', true);

            const newRestaurant = {
            name: 'New Restaurant',
                address: '321 Elm St',
                phone: '555-0004',
                opening_hours: '8AM-8PM'
         };

            const savedRestaurant = {
                _id: '3',
                ...newRestaurant
            };

      Restaurant.prototype.save = jest.fn().mockResolvedValue(savedRestaurant);

         const res = await supertest(app)
                .post('/api/restaurants')
                .set('auth-token', adminToken)
                .send(newRestaurant);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe(newRestaurant.name);
            expect(res.body.address).toBe(newRestaurant.address);
        });

     it('should deny regular user from creating restaurant', async () => {
            const userToken = generateToken('123', false);

        const newRestaurant = {
                name: 'Unauthorized Restaurant',
                address: '999 Fake St',
                phone: '555-9999',
                opening_hours: '9AM-9PM'
            };

          const res = await supertest(app)
                .post('/api/restaurants')
                .set('auth-token', userToken)
                .send(newRestaurant);

            expect(res.status).toBe(403);
            expect(res.body.error).toContain('not allowed');
        });

    });

    //  UPDATE RESTAURANT 
    describe('PUT /api/restaurants/:id - Update Restaurant', () => {
        
        it('should allow admin to update a restaurant', async () => {
            const adminToken = generateToken('999', true);

            const updateData = {
                name: 'Updated Restaurant Name',
                phone: '555-1111'
            };

            const updatedRestaurant = {
                _id: '1',
                name: 'Updated Restaurant Name',
                address: '123 Main St',
                phone: '555-1111',
                opening_hours: '9AM-9PM'
            };

            Restaurant.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedRestaurant);

            const res = await supertest(app)
                .put('/api/restaurants/1')
                .set('auth-token', adminToken)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.phone).toBe(updateData.phone);
        });

    it('should deny regular user from updating restaurant', async () => {
            const userToken = generateToken('123', false);

            const res = await supertest(app)
                .put('/api/restaurants/1')
                .set('auth-token', userToken)
                .send({ name: 'Hacked Name' });

            expect(res.status).toBe(403);
        });

     it('should return 404 if restaurant not found', async () => {
         const adminToken = generateToken('999', true);

         Restaurant.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .put('/api/restaurants/999')
                .set('auth-token', adminToken)
                .send({ name: 'Non-existent' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Restaurant not found');
        });
    });

    //  DELETE RESTAURANT 
    describe('DELETE /api/restaurants/:id - Delete Restaurant', () => {
        
        it('should allow admin to delete a restaurant', async () => {
            const adminToken = generateToken('999', true);

            Restaurant.findByIdAndDelete = jest.fn().mockResolvedValue({
                _id: '1',
                name: 'Deleted Restaurant'
            });

            const res = await supertest(app)
                .delete('/api/restaurants/1')
                .set('auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Restaurant deleted successfully');
        });

        it('should deny regular user from deleting restaurant', async () => {
            const userToken = generateToken('123', false);

            const res = await supertest(app)
                .delete('/api/restaurants/1')
                .set('auth-token', userToken);

            expect(res.status).toBe(403);
        });

        it('should return 404 if restaurant not found', async () => {
            const adminToken = generateToken('999', true);

            Restaurant.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .delete('/api/restaurants/999')
                .set('auth-token', adminToken);

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Restaurant not found');
        });
    });
});
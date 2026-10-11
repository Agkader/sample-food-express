// Mock database BEFORE any imports
jest.mock('../config/db.config.js', () => ({}));

const supertest = require('supertest');
const { app, index } = require('../index');
const Menu = require('../models/menu.model');
const jwt = require('jsonwebtoken');

jest.mock('../models/menu.model');

const generateToken = (userId, isAdmin = false) => {
    return jwt.sign(
        { id: userId.toString(), isAdmin: isAdmin },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

describe('Menu Routes', () => {
    
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

    //  GET ALL MENUS (PUBLIC)
    describe('GET /api/menus - Get All Menus', () => {
        
        it('should get all menus without authentication', async () => {
            const mockMenus = [
                {
                    _id: '1',
                    restaurant_id: 'rest1',
                    name: 'Margherita Pizza',
                    description: 'Classic pizza',
                    price: 12.99,
                    category: 'pizza'
                },
                {
                    _id: '2',
                    restaurant_id: 'rest1',
                    name: 'Caesar Salad',
                    description: 'Fresh salad',
                    price: 8.99,
                    category: 'salad'
                }
            ];

            Menu.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockMenus)
                        })
                    })
                })
            });

            Menu.countDocuments = jest.fn().mockResolvedValue(2);

            const res = await supertest(app)
                .get('/api/menus');

            expect(res.status).toBe(200);
            expect(res.body.menus).toHaveLength(2);
            expect(res.body.menus[0].name).toBe('Margherita Pizza');
            expect(res.body.page).toBe(1);
            expect(res.body.limit).toBe(10);
        });
    });

    //  GET MENU BY ID (PUBLIC) 
    describe('GET /api/menus/:id - Get Menu by ID', () => {
        
        it('should get a menu by id without authentication', async () => {
            const mockMenu = {
                _id: '507f1f77bcf86cd799439011',
                restaurant_id: 'rest1',
                name: 'Pepperoni Pizza',
                description: 'Spicy pizza',
                price: 14.99,
                category: 'pizza'
            };

            Menu.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockMenu)
            });

            const res = await supertest(app)
                .get('/api/menus/507f1f77bcf86cd799439011');

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Pepperoni Pizza');
            expect(res.body.price).toBe(14.99);
        });

        it('should return 404 if menu not found', async () => {
            Menu.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const res = await supertest(app)
                .get('/api/menus/507f1f77bcf86cd799439011');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Menu item not found');
        });
    });

    // GET MENUS BY RESTAURANT (PUBLIC)
    describe('GET /api/menus/restaurant/:restaurantId - Get Menus by Restaurant', () => {
        
        it('should get all menus for a specific restaurant', async () => {
            const mockMenus = [
                {
                    _id: '1',
                    restaurant_id: 'rest123',
                    name: 'Item 1',
                    price: 10.00
                },
                {
                    _id: '2',
                    restaurant_id: 'rest123',
                    name: 'Item 2',
                    price: 15.00
                }
            ];

            Menu.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockMenus)
                        })
                    })
                })
            });

            Menu.countDocuments = jest.fn().mockResolvedValue(2);

            const res = await supertest(app)
                .get('/api/menus/restaurant/rest123');

            expect(res.status).toBe(200);
            expect(res.body.menus).toHaveLength(2);
        });
    });

    //CREATE MENU (ADMIN ONLY)
    describe('POST /api/menus - Create Menu', () => {
        
        it('should allow admin to create a menu item', async () => {
            const adminToken = generateToken('999', true);

            const newMenu = {
                restaurant_id: 'rest1',
                name: 'New Dish',
                description: 'Delicious food',
                price: 19.99,
                category: 'main'
            };

            const savedMenu = {
                _id: '3',
                ...newMenu
            };

            Menu.prototype.save = jest.fn().mockResolvedValue(savedMenu);

            const res = await supertest(app)
                .post('/api/menus')
                .set('auth-token', adminToken)
                .send(newMenu);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe(newMenu.name);
            expect(res.body.price).toBe(newMenu.price);
        });

        it('should deny regular user from creating menu', async () => {
            const userToken = generateToken('123', false);

            const newMenu = {
                restaurant_id: 'rest1',
                name: 'Unauthorized Item',
                price: 9.99
            };

            const res = await supertest(app)
                .post('/api/menus')
                .set('auth-token', userToken)
                .send(newMenu);

            expect(res.status).toBe(403);
        });
    });

    // UPDATE MENU (ADMIN ONLY)
    describe('PUT /api/menus/:id - Update Menu', () => {
        
        it('should allow admin to update a menu item', async () => {
            const adminToken = generateToken('999', true);

            const updateData = {
                name: 'Updated Dish Name',
                price: 24.99
            };

            const updatedMenu = {
                _id: '1',
                restaurant_id: 'rest1',
                name: 'Updated Dish Name',
                description: 'Delicious food',
                price: 24.99,
                category: 'main'
            };

            Menu.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMenu);

            const res = await supertest(app)
                .put('/api/menus/1')
                .set('auth-token', adminToken)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.price).toBe(updateData.price);
        });

        it('should deny regular user from updating menu', async () => {
            const userToken = generateToken('123', false);

            const res = await supertest(app)
                .put('/api/menus/1')
                .set('auth-token', userToken)
                .send({ price: 99.99 });

            expect(res.status).toBe(403);
        });

        it('should return 404 if menu not found', async () => {
            const adminToken = generateToken('999', true);

            Menu.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .put('/api/menus/999')
                .set('auth-token', adminToken)
                .send({ name: 'Non-existent' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Menu item not found');
        });
    });

    // DELETE MENU (ADMIN ONLY) 
    describe('DELETE /api/menus/:id - Delete Menu', () => {
        
        it('should allow admin to delete a menu item', async () => {
            const adminToken = generateToken('999', true);

            Menu.findByIdAndDelete = jest.fn().mockResolvedValue({
                _id: '1',
                name: 'Deleted Item'
            });

            const res = await supertest(app)
                .delete('/api/menus/1')
                .set('auth-token', adminToken);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Menu item deleted successfully');
        });

        it('should deny regular user from deleting menu', async () => {
            const userToken = generateToken('123', false);

            const res = await supertest(app)
                .delete('/api/menus/1')
                .set('auth-token', userToken);

            expect(res.status).toBe(403);
        });

        it('should return 404 if menu not found', async () => {
            const adminToken = generateToken('999', true);

            Menu.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const res = await supertest(app)
                .delete('/api/menus/999')
                .set('auth-token', adminToken);

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Menu item not found');
        });
    });
});
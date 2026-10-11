const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Restaurant = require('../models/restaurant.model');

// Get all restaurants with sorting & pagination (PUBLIC)
const getAllRestaurants = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = req.query.sortBy || 'name';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };

        const restaurants = await Restaurant.find()
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Restaurant.countDocuments();

        res.json({
            page,
            limit,
            total,
            restaurants
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get single restaurant (PUBLIC)
const getRestaurantbyIid = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create restaurant (ADMIN ONLY)
const createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        const savedRestaurant = await restaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update restaurant (ADMIN ONLY)
const updateRestaurant = async (req, res) => {
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete restaurant (ADMIN ONLY)
const deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantbyIid,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
const Menu = require('../models/menu.model');

// Create menu (ADMIN ONLY)
const createMenu = async (req, res) => {
    try {
        const newMenu = new Menu(req.body);
        const savedMenu = await newMenu.save();
        res.status(201).json(savedMenu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
};
// 
// Get all menus with sorting & pagination (PUBLIC)
const getAllMenus = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = req.query.sortBy || 'price'; 
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };

        // Filter by restaurant if provided
        const filter = {};
        if (req.query.restaurant_id) {
            filter.restaurant_id = req.query.restaurant_id;
        }

        const menus = await Menu.find(filter)
            .populate('restaurant_id', 'name address') // Include restaurant info
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Menu.countDocuments(filter);

        res.json({
            page,
            limit,
            total,
            menus
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};  

// Get single menu (PUBLIC)
const getMenuById = async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id).populate('restaurant_id', 'name address');
        if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get menus by restaurant (PUBLIC)
const getMenusByRestaurant = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'price';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };

        const menus = await Menu.find({ restaurant_id: req.params.restaurantId })
            .populate('restaurant_id', 'name address')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Menu.countDocuments({ restaurant_id: req.params.restaurantId });

        res.json({
            page,
            limit,
            total,
            menus
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update menu (ADMIN ONLY)
const updateMenu = async (req, res) => {
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedMenu) return res.status(404).json({ error: 'Menu item not found' });
        res.json(updatedMenu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};  

// Delete menu (ADMIN ONLY)
const deleteMenu = async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedMenu) return res.status(404).json({ error: 'Menu item not found' });
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createMenu,
    getAllMenus,
    getMenuById, 
    getMenusByRestaurant, 
    updateMenu,
    deleteMenu
};
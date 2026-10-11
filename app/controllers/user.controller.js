const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { updateValidation } = require('../middleware/validation');

// get user by id 
const getUserById = async (req, res) => {
    try { 
        const user = await User.findById(req.params.id).select('-password'); // Don't return password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// get all users
 const getAllUsers = async (req, res) => {
    try {
     const users = await User.find().select('-password'); 
     res.json(users);
  } catch (err) {
           res.status(500).json({ error: err.message });
   }
};

// Update user 
const updateUser = async (req, res) => {
    try {
           // validation
        const { error } = updateValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Hash password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        ).select('-password'); // Don't return password
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
         res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Delete user account
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { updateUser, deleteUser, getUserById, getAllUsers };
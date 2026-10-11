const User = require('../models/user.model');
const { registerValidation, loginValidation } = require('../middleware/validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register controller
const registerUser = async (req, res) => {
    try {
        // Validate data before creating a user
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the user is already in the database
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const user = new User({
            username: req.body.username,  
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        
        // Return 201 status with user details (without password)
        res.status(201).json({ 
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin || false
        });

    } catch (err) {
        res.status(400).json({ error: err.message || 'Registration failed' });
    }
};


// Login controller
const loginUser = async (req, res) => {
    try {
        // Validate data before logging in
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the email exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Email is not found' });
        }

        // Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Create token with string ID
        const token = jwt.sign(
            { id: user._id.toString(), isAdmin: user.isAdmin || false },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        // Send response with token
        res.header('auth-token', token).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin || false
            }
        });
        
    } catch (err) {
        res.status(400).json({ error: err.message || 'Login failed' });
    }
};

// Export the controller functions
module.exports = {
    registerUser,
    loginUser
};
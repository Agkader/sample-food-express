const mongoose = require('mongoose');


// Define the User schema
const userSchema = new mongoose.Schema({  
    username: { 
        type: String, 
        required: true, 
        minlength: 6, 
        maxlength: 255,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        maxlength: 255, 
        minlength: 6,
        unique: true
    },
    password: { 
        type: String, 
        required: true, 
        maxlength: 1024, 
        minlength: 6 
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true  
});

module.exports = mongoose.model('User', userSchema);
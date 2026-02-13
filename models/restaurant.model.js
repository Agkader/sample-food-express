const mongoose = require('mongoose');


// Define the Restaurant schema
const restaurantSchema = new mongoose.Schema({  
    name: { 
        type: String,
        required: true, 
        maxlength: 255 
    },
    address: { 
        type: String, 
        required: true,
        maxlength: 1024
    },
    phone: {
        type: String,
        required: true,
        maxlength: 15
    },
    openingHours: {
        type: String,
        required: true,
        maxlength: 255
    },
}, { 
    timestamps: true  
});
module.exports = mongoose.model('Restaurant', restaurantSchema);
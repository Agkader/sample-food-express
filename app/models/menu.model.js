const mongoose = require('mongoose');
// Define the Menu schema
const menuSchema = new mongoose.Schema({  
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: { 
        type: String,
        required: true, 
        maxlength: 255 
    },
    description: { 
        type: String, 
        required: true,
        maxlength: 1024 
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        maxlength: 255  
    },
  
}, { 
    timestamps: true  
});
module.exports = mongoose.model('Menu', menuSchema);
// Validation 
const Joi = require('@hapi/joi');
// Register Validation
const registerValidation = (data) => {
   
     const schema = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
}); 
    return schema.validate(data);
}
// Login Validation
const loginValidation = (data) => {
   
     const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
}).or('email', 'username');
    return schema.validate(data);
}

// update validation 
const updateValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().max(255).optional(),
        email: Joi.string().min(6).max(255).email().optional(),
        password: Joi.string().min(6).max(1024).optional()
    });
    return schema.validate(data);
};


module.exports.updateValidation = updateValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

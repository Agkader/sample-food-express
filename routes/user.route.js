const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/auth');
const {verifyUserOrAdmin,verifyTokenAdmin} = require('../middleware/verifytoken');
const { updateUser,deleteUser,getUserById,getAllUsers} = require('../controllers/user.controller');
const User = require('../models/user.model');

// Public  routes for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

//get user by id route
router.get("/:id", verifyUserOrAdmin, getUserById);
//user update route 
router.put("/:id", verifyUserOrAdmin, updateUser);
//user delete route 
router.delete("/:id",verifyUserOrAdmin, deleteUser);
//get all users route   
router.get("/", verifyTokenAdmin, getAllUsers);

module.exports = router;
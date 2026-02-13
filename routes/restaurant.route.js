const router = require('express').Router();
const{ getAllRestaurants,getRestaurantbyIid,
    createRestaurant,updateRestaurant,deleteRestaurant} = require('../controllers/restaurant.controller');
const {verifyTokenAdmin} = require('../middleware/verifytoken');


// Public routes
// get all restaurants
router.get('/',getAllRestaurants);
// get restaurant by id
router.get('/:id',getRestaurantbyIid);


// private routes
// create restaurant 
router.post('/',verifyTokenAdmin,createRestaurant);
// update restaurant 
router.put('/:id',verifyTokenAdmin,  updateRestaurant);
// delete restaurant
router.delete('/:id',verifyTokenAdmin, deleteRestaurant);


module.exports = router;
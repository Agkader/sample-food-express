const router = require('express').Router();
const{  createMenu, getAllMenus,  getMenuById, getMenusByRestaurant,
     updateMenu,deleteMenu} = require('../controllers/menu.controller');
const {verifyTokenAdmin} = require('../middleware/verifytoken');

// Public routes
// get all menus
router.get('/', getAllMenus);
// get menus by restaurant
router.get('/restaurant/:restaurantId', getMenusByRestaurant);
// get menu by id
router.get('/:id', getMenuById);

// private routes
// create menu (ADMIN ONLY)
router.post('/',verifyTokenAdmin,createMenu);
// update menu (ADMIN ONLY)
router.put('/:id',verifyTokenAdmin,   updateMenu);
// delete menu (ADMIN ONLY)
router.delete('/:id',verifyTokenAdmin, deleteMenu);

module.exports = router;
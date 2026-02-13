const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
require('./config/db.config');

// swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerjsDoc = require('swagger-jsdoc');

// Middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Swagger setup
const options = { 
  definition:{
    openapi: '3.0.0',
    info: {
      title: 'user API', version: '1.0.0'}
  },
  apis : ['swagger.yaml']
  }
  const swaggerSpec = swaggerjsDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const authRoutes = require('./routes/user.route');
const restaurantRoutes = require('./routes/restaurant.route');
const menuRoutes = require('./routes/menu.route');

//routes middleware
app.use('/api/user', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);

// Start the server
const index = app.listen (port, () => {
  console.log(`Server is running on http://localhost:3000`);
});

module.exports = { app, index };
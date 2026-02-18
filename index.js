const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');

// En production (Cloud), les variables sont injectées, le .env est ignoré s'il n'existe pas
dotenv.config();

require('./config/db.config');

// swagger documentation
const swaggerUi = require('swagger-ui-express');

// --- MODIFICATION ICI ---
// On charge directement le fichier JSON.
// Plus besoin de swagger-jsdoc ni d'options compliquées.
const swaggerDocument = require('./swagger.json');

// Middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// --- SETUP SWAGGER SIMPLIFIÉ ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- BONUS : REDIRECTION ---
// Si on va sur l'accueil, on est redirigé vers la doc
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Import routes
const authRoutes = require('./routes/user.route');
const restaurantRoutes = require('./routes/restaurant.route');
const menuRoutes = require('./routes/menu.route');

//routes middleware
app.use('/api/user', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);

// Start the server
const index = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, index };
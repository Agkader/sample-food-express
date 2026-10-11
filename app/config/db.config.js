require('dotenv').config();
//connect to database
const mongoose = require('mongoose');
mongoose.connect( process.env.DB_CONNECT )
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Database connection error:', error));

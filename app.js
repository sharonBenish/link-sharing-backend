const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authroutes = require('./routes/auth');
const profileroutes = require('./routes/profile');
const linkroutes = require('./routes/link');

dotenv.config();
// Create an instance of an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const dbURI =  process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => { 
    app.listen(3000, ()=>{
      console.log('Server running on port 3000');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Use the auth routes
app.use('/api/auth', authroutes);

//Use the profile routes
app.use('/api', profileroutes);

// Use the link routes
app.use('/api/links', linkroutes);

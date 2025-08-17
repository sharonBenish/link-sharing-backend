const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authroutes = require('./routes/auth');
const profileroutes = require('./routes/profile');
const linkroutes = require('./routes/link');

dotenv.config();
// Create an instance of an Express application
const app = express();

// Middleware to enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173", // for local dev
    "https://link-sharing-app-beta-three.vercel.app/" // replace with your actual frontend domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials if needed
}));

// Handle preflight requests globally
app.options('*', cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const dbURI =  process.env.MONGO_URI;

const PORT = process.env.PORT || 5000;

mongoose.connect(dbURI)
  .then(() => { 
    app.listen(PORT, ()=>{
      console.log('Server running on port', PORT);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Use the auth routes
app.use('/api/auth', authroutes);

//Use the profile routes
app.use('/api', profileroutes);

// Use the link routes
app.use('/api/links', linkroutes);

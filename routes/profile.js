const express = require('express');
const router = express.Router();
const { editProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/profile/:userId', authMiddleware ,editProfile);

module.exports = router;
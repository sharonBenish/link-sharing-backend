const express = require('express');
const router = express.Router();
const { editProfile } = require('../controllers/userController');

router.put('/profile/:userId', editProfile);

module.exports = router;
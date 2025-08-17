const express = require('express');
const router = express.Router();
const { signUp, signIn, logOut, refreshAccessToken } = require('../controllers/authController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logOut);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
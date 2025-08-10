const express = require('express');
const router = express.Router();
const { addLinks, getLinks } = require('../controllers/linkController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addLinks);
router.get('/:userId', getLinks);

module.exports = router;
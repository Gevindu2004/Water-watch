const express = require('express');
const router = express.Router();
const { resetDemo, updateShortage } = require('../controllers/demoController');

router.post('/reset', resetDemo);
router.post('/update-shortage', updateShortage);

module.exports = router;

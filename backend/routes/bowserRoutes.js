const express = require('express');
const router = express.Router();
const { getBowsers, dispatch, getResidentFeed } = require('../controllers/bowserController');

router.get('/', getBowsers);
router.post('/dispatch', dispatch);
router.get('/notifications/resident-feed', getResidentFeed);

module.exports = router;

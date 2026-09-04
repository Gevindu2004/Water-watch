const express = require('express');
const router = express.Router();
const { getPriorities, getPriorityByVillage } = require('../controllers/priorityController');

router.get('/', getPriorities);
router.get('/:villageId', getPriorityByVillage);

module.exports = router;

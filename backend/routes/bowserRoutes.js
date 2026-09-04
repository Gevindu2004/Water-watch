const express = require('express');
const router = express.Router();
const {
  getAllBowsers,
  createBowser,
  updateBowser,
  updateBowserStatus
} = require('../controllers/bowserController');

router.route('/')
  .get(getAllBowsers)
  .post(createBowser);

router.route('/:id')
  .put(updateBowser);

router.route('/:id/status')
  .patch(updateBowserStatus);

module.exports = router;

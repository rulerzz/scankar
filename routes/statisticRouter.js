const express = require('express');
const {
    getStatistics
} = require("../controllers/statisticController");
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:id').get(protect, getStatistics);

module.exports = router;

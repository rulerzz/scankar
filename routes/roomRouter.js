const express = require('express');
const {
    status, rooms, getstatus, updatestatus, orders
} = require("../controllers/roomController");
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/status').post(protect, status).get(protect, getstatus).put(protect, updatestatus);
router.route('/:user').get(protect, rooms);
router.route('/orders/:user').get(protect, orders);
module.exports = router;

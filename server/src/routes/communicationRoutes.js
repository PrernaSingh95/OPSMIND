const express = require('express');
const router = express.Router();
const { getCommunications, sendSimulatedCommunication } = require('../controllers/communicationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCommunications);
router.post('/:id/send', protect, sendSimulatedCommunication);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getApprovals, decideApproval } = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getApprovals);
router.post('/:id/decide', protect, authorize('Admin', 'Manager'), decideApproval);

module.exports = router;

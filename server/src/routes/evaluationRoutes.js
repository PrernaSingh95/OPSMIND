const express = require('express');
const router = express.Router();
const { getLatestEvaluation, runEvaluationSuite } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/latest', protect, getLatestEvaluation);
router.post('/run', protect, authorize('Admin', 'Manager'), runEvaluationSuite);

module.exports = router;

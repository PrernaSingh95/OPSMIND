const express = require('express');
const router = express.Router();
const { getPrompts, createPromptVersion, comparePrompts } = require('../controllers/promptController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getPrompts)
  .post(protect, authorize('Admin', 'Manager'), createPromptVersion);

router.post('/compare', protect, comparePrompts);

module.exports = router;

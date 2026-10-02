const express = require('express');
const router = express.Router();
const {
  getCases,
  getCaseById,
  createCase,
  processCaseWorkflow,
  deleteCase
} = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCases)
  .post(protect, createCase);

router.route('/:id')
  .get(protect, getCaseById)
  .delete(protect, deleteCase);

router.post('/:id/process', protect, processCaseWorkflow);

module.exports = router;

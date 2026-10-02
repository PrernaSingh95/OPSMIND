const express = require('express');
const router = express.Router();
const {
  getDocuments,
  searchDocuments,
  createDocument,
  deleteDocument
} = require('../controllers/knowledgeController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getDocuments)
  .post(protect, authorize('Admin', 'Manager'), createDocument);

router.post('/search', protect, searchDocuments);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteDocument);

module.exports = router;

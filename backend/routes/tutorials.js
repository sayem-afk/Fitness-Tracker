const express = require('express');
const router = express.Router();
const {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial
} = require('../controllers/tutorialController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getTutorials);
router.get('/:id', getTutorialById);

// Admin routes (protected)
router.post('/', auth, createTutorial);
router.put('/:id', auth, updateTutorial);
router.delete('/:id', auth, deleteTutorial);

module.exports = router;

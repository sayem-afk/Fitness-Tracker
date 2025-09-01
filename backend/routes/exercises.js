const express = require('express');
const router = express.Router();
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getExercises);
router.get('/:id', getExerciseById);

// Admin routes (protected)
router.post('/', auth, createExercise);
router.put('/:id', auth, updateExercise);
router.delete('/:id', auth, deleteExercise);

module.exports = router;

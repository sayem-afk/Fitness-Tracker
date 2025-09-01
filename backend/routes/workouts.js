const express = require('express');
const { addWorkout, getUserWorkouts, getWorkoutStats } = require('../controllers/workoutController');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/workouts - Add new workout
router.post('/', auth, addWorkout);

// GET /api/workouts - Get user workouts
router.get('/', auth, getUserWorkouts);

// GET /api/workouts/stats - Get workout statistics
router.get('/stats', auth, getWorkoutStats);

module.exports = router;
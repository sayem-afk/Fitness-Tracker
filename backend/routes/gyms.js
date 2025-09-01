const express = require('express');
const router = express.Router();
const {
  getGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym,
  getCities
} = require('../controllers/gymController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getGyms);
router.get('/cities', getCities);
router.get('/:id', getGymById);

// Admin routes (protected)
router.post('/', auth, createGym);
router.put('/:id', auth, updateGym);
router.delete('/:id', auth, deleteGym);

module.exports = router;

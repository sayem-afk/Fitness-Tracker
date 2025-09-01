const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getFeaturedBlog,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
} = require('../controllers/blogController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlog);
router.get('/:id', getBlogById);
router.post('/:id/like', likeBlog);

// Admin routes (protected)
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;

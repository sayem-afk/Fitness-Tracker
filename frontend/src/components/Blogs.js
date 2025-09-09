import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Blogs.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const navigate = useNavigate();

  const categories = ['All', 'Nutrition', 'Training', 'Wellness', 'Equipment'];

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlog();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs', {
        params: {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined
        }
      });
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const fetchFeaturedBlog = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs/featured');
      setFeaturedBlog(response.data);
    } catch (error) {
      console.error('Error fetching featured blog:', error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      await axios.post(`http://localhost:5000/api/blogs/${blogId}/like`);
      setLikedBlogs(prev => new Set([...prev, blogId]));
      fetchBlogs();
      if (featuredBlog && featuredBlog._id === blogId) {
        fetchFeaturedBlog();
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleReadMore = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const filteredBlogs = blogs.filter(blog => {
    if (featuredBlog && blog._id === featuredBlog._id) return false;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h2>Fitness Blog</h2>
        <p>Discover the latest insights, tips, and research in fitness and wellness</p>
      </div>

      <div className="blogs-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search articles..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {featuredBlog && (
        <div className="featured-post">
          <div className="featured-image">
            <div className="placeholder-image large">
              <div className="image-icon">📝</div>
            </div>
          </div>
          <div className="featured-content">
            <div className="featured-meta">
              <span className="featured-label">Featured</span>
              <span className="featured-date">{formatDate(featuredBlog.createdAt)}</span>
            </div>
            <h2 className="featured-title">{featuredBlog.title}</h2>
            <p className="featured-excerpt">{featuredBlog.excerpt}</p>
            <div className="featured-author">
              <div className="author-avatar">
                {featuredBlog.author.charAt(0)}
              </div>
              <div className="author-info">
                <div className="author-name">{featuredBlog.author}</div>
                <div className="author-read-time">{featuredBlog.readTime} min read</div>
              </div>
            </div>
            <button className="featured-read-btn">Read Full Article</button>
          </div>
        </div>
      )}

      <div className="blogs-section">
        <div className="section-header">
          <h3>Latest Articles</h3>
          <span className="results-count">{filteredBlogs.length} articles found</span>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📝</div>
            <h3>No articles found</h3>
            <p>Try adjusting your search or browse all categories</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <div className="blog-image">
                  <div className="placeholder-image">
                    <div className="image-icon">📝</div>
                  </div>
                  <div className="blog-category">{blog.category}</div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-author">{blog.author}</span>
                    <span>•</span>
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>•</span>
                    <span>{blog.readTime} min read</span>
                  </div>
                  
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="blog-footer">
                    <div className="blog-stats">
                      <button 
                        className={`like-btn ${likedBlogs.has(blog._id) ? 'liked' : ''}`}
                        onClick={() => handleLike(blog._id)}
                      >
                        ❤️ {blog.likes}
                      </button>
                      <span className="comments-count">💬 {blog.comments}</span>
                    </div>
                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(blog._id)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="newsletter-section">
        <div className="newsletter-content">
          <h3>Stay Updated</h3>
          <p>Get the latest fitness tips and articles delivered to your inbox</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
          <small>We respect your privacy. Unsubscribe at any time.</small>
        </div>
      </div>

      <div className="popular-tags">
        <h3>Popular Tags</h3>
        <div className="tags-cloud">
          {['nutrition', 'strength training', 'cardio', 'wellness', 'meal prep', 'HIIT', 'yoga', 'recovery'].map(tag => (
            <span key={tag} className="tag-cloud-item">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;

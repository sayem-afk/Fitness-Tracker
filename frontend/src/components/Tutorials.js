import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tutorials.css';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'Nutrition'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchTutorials();
  }, []);

  useEffect(() => {
    fetchTutorials();
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const fetchTutorials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tutorials', {
        params: {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
          search: searchTerm || undefined
        }
      });
      setTutorials(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setLoading(false);
    }
  };

  const handleTutorialClick = async (tutorial) => {
    try {
      // Increment view count
      await axios.get(`http://localhost:5000/api/tutorials/${tutorial._id}`);
      setSelectedTutorial(tutorial);
      fetchTutorials(); // Refresh to get updated view count
    } catch (error) {
      console.error('Error viewing tutorial:', error);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#22c55e';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="loading">Loading tutorials...</div>;
  }

  if (selectedTutorial) {
    return (
      <div className="tutorial-detail">
        <button 
          className="back-btn"
          onClick={() => setSelectedTutorial(null)}
        >
          ← Back to Tutorials
        </button>
        
        <div className="tutorial-header">
          <h1>{selectedTutorial.title}</h1>
          <div className="tutorial-meta">
            <span className="category">{selectedTutorial.category}</span>
            <span 
              className="difficulty"
              style={{ backgroundColor: getDifficultyColor(selectedTutorial.difficulty) }}
            >
              {selectedTutorial.difficulty}
            </span>
            <span className="duration">{formatDuration(selectedTutorial.duration)}</span>
            <span className="views">{selectedTutorial.views} views</span>
          </div>
        </div>

        <div className="tutorial-content">
          <div className="video-section">
            <div className="video-placeholder">
              <div className="play-icon">▶</div>
              <p>Video Tutorial</p>
              {selectedTutorial.videoUrl && (
                <small>Video: {selectedTutorial.videoUrl}</small>
              )}
            </div>
          </div>

          <div className="tutorial-info">
            <div className="description">
              <h3>Description</h3>
              <p>{selectedTutorial.description}</p>
            </div>

            {selectedTutorial.equipment && selectedTutorial.equipment.length > 0 && (
              <div className="equipment">
                <h3>Equipment Needed</h3>
                <div className="equipment-list">
                  {selectedTutorial.equipment.map((item, index) => (
                    <span key={index} className="equipment-item">{item}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="steps">
              <h3>Step-by-Step Instructions</h3>
              <div className="steps-list">
                {selectedTutorial.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{step.step}</div>
                    <div className="step-content">
                      <p>{step.instruction}</p>
                      {step.duration && (
                        <span className="step-duration">{step.duration}s</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorials-container">
      <div className="tutorials-header">
        <h2>Workout Tutorials</h2>
        <p>Learn proper form and technique with our step-by-step video guides</p>
      </div>

      <div className="tutorials-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search tutorials..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="results-header">
        <h3>Available Tutorials</h3>
        <span className="results-count">{tutorials.length} tutorials found</span>
      </div>

      {tutorials.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🎥</div>
          <h3>No tutorials found</h3>
          <p>Try adjusting your search criteria or browse different categories</p>
        </div>
      ) : (
        <div className="tutorials-grid">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial._id} 
              className={`tutorial-card ${tutorial.featured ? 'featured' : ''}`}
              onClick={() => handleTutorialClick(tutorial)}
            >
              {tutorial.featured && <div className="featured-badge">Featured</div>}
              
              <div className="tutorial-thumbnail">
                <div className="thumbnail-placeholder">
                  <div className="play-icon">▶</div>
                </div>
                <div className="tutorial-duration">{formatDuration(tutorial.duration)}</div>
              </div>

              <div className="tutorial-content">
                <h3 className="tutorial-title">{tutorial.title}</h3>
                <p className="tutorial-description">{tutorial.description}</p>

                <div className="tutorial-meta">
                  <span className="tutorial-category">{tutorial.category}</span>
                  <span 
                    className="tutorial-difficulty"
                    style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                  >
                    {tutorial.difficulty}
                  </span>
                </div>

                {tutorial.equipment && tutorial.equipment.length > 0 && (
                  <div className="equipment-preview">
                    <span className="equipment-label">Equipment:</span>
                    <span className="equipment-text">
                      {tutorial.equipment.slice(0, 2).join(', ')}
                      {tutorial.equipment.length > 2 && ` +${tutorial.equipment.length - 2} more`}
                    </span>
                  </div>
                )}

                <div className="tutorial-stats">
                  <span className="views-count">{tutorial.views} views</span>
                  <span className="steps-count">{tutorial.steps.length} steps</span>
                </div>

                {tutorial.videoUrl && (
                  <a
                    href={tutorial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tutorial-link"
                  >
                    Watch Tutorial
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutorials;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Gyms.css';

const Gyms = () => {
  const [gyms, setGyms] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const priceRanges = ['All', '$', '$$', '$$$'];

  useEffect(() => {
    fetchGyms();
    fetchCities();
  }, []);

  useEffect(() => {
    fetchGyms();
  }, [selectedCity, selectedPriceRange, searchTerm]);

  const fetchGyms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gyms', {
        params: {
          city: selectedCity !== 'All' ? selectedCity : undefined,
          priceRange: selectedPriceRange !== 'All' ? selectedPriceRange : undefined,
          search: searchTerm || undefined
        }
      });
      setGyms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gyms:', error);
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gyms/cities');
      setCities(['All', ...response.data]);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  if (loading) {
    return <div className="loading">Loading gyms...</div>;
  }

  return (
    <div className="gyms-container">
      <div className="gyms-header">
        <h2>Find Your Perfect Gym</h2>
        <p>Discover top-rated gyms and fitness centers in your area</p>
      </div>

      <div className="gyms-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search gyms, amenities, or locations..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>City:</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-select"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="filter-select"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="results-header">
        <h3>Available Gyms</h3>
        <span className="results-count">{gyms.length} gyms found</span>
      </div>

      {gyms.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🏋️‍♂️</div>
          <h3>No gyms found</h3>
          <p>Try adjusting your search criteria or explore different areas</p>
        </div>
      ) : (
        <div className="gyms-grid">
          {gyms.map((gym) => (
            <div key={gym._id} className={`gym-card ${gym.featured ? 'featured' : ''}`}>
              {gym.featured && <div className="featured-badge">Featured</div>}
              
              <div className="gym-image">
                <div className="placeholder-image">
                  <div className="image-icon">🏋️‍♂️</div>
                </div>
                <div className="gym-price">{gym.priceRange}</div>
              </div>

              <div className="gym-content">
                <div className="gym-header">
                  <h3 className="gym-name">{gym.name}</h3>
                  <div className="gym-rating">
                    <div className="stars">
                      {renderStars(gym.rating)}
                    </div>
                    <span className="rating-number">({gym.rating})</span>
                  </div>
                </div>

                <div className="gym-location">
                  <span className="location-icon">📍</span>
                  <span>{gym.address}, {gym.city}</span>
                </div>

                <div className="gym-contact">
                  <span className="phone-icon">📞</span>
                  <span>{formatPhoneNumber(gym.phone)}</span>
                </div>

                <div className="gym-hours">
                  <div className="hours-item">
                    <span>Weekdays:</span>
                    <span>{gym.hours.weekday}</span>
                  </div>
                  <div className="hours-item">
                    <span>Weekends:</span>
                    <span>{gym.hours.weekend}</span>
                  </div>
                </div>

                <div className="gym-amenities">
                  <h4>Amenities:</h4>
                  <div className="amenities-list">
                    {gym.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {gym.amenities.length > 4 && (
                      <span className="amenity-more">+{gym.amenities.length - 4} more</span>
                    )}
                  </div>
                </div>

                {gym.membershipTypes && gym.membershipTypes.length > 0 && (
                  <div className="membership-plans">
                    <h4>Membership Plans:</h4>
                    <div className="plans-list">
                      {gym.membershipTypes.map((plan, index) => (
                        <div key={index} className="plan-item">
                          <span className="plan-name">{plan.name}</span>
                          <span className="plan-price">${plan.price}/{plan.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="gym-actions">
                  <button className="contact-btn">Contact Gym</button>
                  <button className="visit-btn">Visit Website</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="map-section">
        <h3>Gym Locations</h3>
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Interactive map coming soon!</p>
          <p>Explore gym locations on an interactive map</p>
        </div>
      </div>
    </div>
  );
};

export default Gyms;

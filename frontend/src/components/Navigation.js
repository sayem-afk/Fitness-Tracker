import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/workouts', label: 'Workouts', icon: '💪' },
    { path: '/statistics', label: 'Statistics', icon: '📊' },
    { path: '/gyms', label: 'Gyms', icon: '🏋️' },
    { path: '/tutorials', label: 'Tutorials', icon: '🎥' },
    { path: '/blogs', label: 'Blogs', icon: '📝' },
    ...(user && user.email === 'admin@fitnesstracker.com' ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : [])
  ];

  // Split navigation items into two rows
  const firstRowItems = navigationItems.slice(0, Math.ceil(navigationItems.length / 2));
  const secondRowItems = navigationItems.slice(Math.ceil(navigationItems.length / 2));

  return (
    <nav className="navigation">
      {/* First Row - Brand and User Info */}
      <div className="nav-container nav-top-row">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">🏃‍♂️</span>
            <span className="brand-text">FitnessTracker</span>
          </Link>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          
          <div className="user-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span className="nav-label">Sign Out</span>
            </button>
          </div>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Second Row - Navigation Menu */}
      <div className="nav-container nav-bottom-row">
        <div className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}>
          <div className="nav-menu-row">
            {firstRowItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
          {secondRowItems.length > 0 && (
            <div className="nav-menu-row">
              {secondRowItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

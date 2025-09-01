import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { 
      title: 'Add Workout', 
      description: 'Log your latest exercise session',
      icon: '💪', 
      action: () => navigate('/workouts'),
      color: 'blue'
    },
    { 
      title: 'View Statistics', 
      description: 'Check your fitness progress',
      icon: '📊', 
      action: () => navigate('/statistics'),
      color: 'green'
    },
    { 
      title: 'Find Gyms', 
      description: 'Discover gyms near you',
      icon: '🏋️', 
      action: () => navigate('/gyms'),
      color: 'purple'
    },
    { 
      title: 'Watch Tutorials', 
      description: 'Learn new exercises',
      icon: '🎥', 
      action: () => navigate('/tutorials'),
      color: 'orange'
    },
    { 
      title: 'Read Blogs', 
      description: 'Get fitness tips and insights',
      icon: '📝', 
      action: () => navigate('/blogs'),
      color: 'red'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <div className="dashboard-grid">
          <div className="welcome-card">
            <div className="welcome-header">
              <h2>Welcome back, {user?.name}! 👋</h2>
              <p>Ready to crush your fitness goals today?</p>
            </div>
            
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-label">Weight:</span>
                <span className="stat-value">{user?.weight || 'Not set'} kg</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Height:</span>
                <span className="stat-value">{user?.height || 'Not set'} cm</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Age:</span>
                <span className="stat-value">{user?.age || 'Not set'} years</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Goal:</span>
                <span className="stat-value">
                  {user?.fitnessGoal === 'lose_weight' && 'Lose Weight'}
                  {user?.fitnessGoal === 'gain_muscle' && 'Gain Muscle'}
                  {user?.fitnessGoal === 'stay_fit' && 'Stay Fit'}
                </span>
              </div>
              <div className="stat-item total-calories">
                <span className="stat-label">Total Calories Burned:</span>
                <span className="stat-value highlight">{user?.totalCaloriesBurned || 0} cal</span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className={`action-button ${action.color}`}
                  onClick={action.action}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <span className="action-title">{action.title}</span>
                    <span className="action-description">{action.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

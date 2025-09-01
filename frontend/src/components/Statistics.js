import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Statistics.css';

const Statistics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weekCalories: 0,
    averageCalories: 0,
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, unit, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">
          {value} <span className="stat-unit">{unit}</span>
        </div>
      </div>
    </div>
  );

  const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.totalCalories));
    
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="simple-bar-chart">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.totalCalories / maxValue) * 100 : 0;
            const monthName = new Date(2023, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' });
            
            return (
              <div key={index} className="bar-item">
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ height: `${height}%` }}
                    title={`${monthName}: ${item.totalCalories} calories`}
                  ></div>
                </div>
                <div className="bar-label">{monthName}</div>
                <div className="bar-value">{item.totalCalories}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const WeeklyProgressChart = () => {
    // Mock weekly data - you can replace this with actual API call
    const weeklyData = [
      { day: 'Mon', calories: 250 },
      { day: 'Tue', calories: 180 },
      { day: 'Wed', calories: 320 },
      { day: 'Thu', calories: 0 },
      { day: 'Fri', calories: 280 },
      { day: 'Sat', calories: 400 },
      { day: 'Sun', calories: 150 }
    ];

    const maxCalories = Math.max(...weeklyData.map(d => d.calories));

    return (
      <div className="chart-container">
        <h3 className="chart-title">This Week's Progress</h3>
        <div className="weekly-chart">
          {weeklyData.map((day, index) => {
            const height = maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
            return (
              <div key={index} className="day-bar">
                <div className="day-bar-container">
                  <div 
                    className="day-bar-fill" 
                    style={{ height: `${height}%` }}
                    title={`${day.day}: ${day.calories} calories`}
                  ></div>
                </div>
                <div className="day-label">{day.day}</div>
                <div className="day-value">{day.calories}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <h2>Fitness Statistics</h2>
        <div className="period-selector">
          <button 
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </button>
          <button 
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </button>
          <button 
            className={selectedPeriod === 'all' ? 'active' : ''}
            onClick={() => setSelectedPeriod('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          unit="sessions"
          icon="🏋️"
          color="blue"
        />
        <StatCard
          title="Week Calories"
          value={stats.weekCalories}
          unit="cal"
          icon="🔥"
          color="orange"
        />
        <StatCard
          title="Average Calories"
          value={stats.averageCalories}
          unit="cal/workout"
          icon="📊"
          color="green"
        />
        <StatCard
          title="Total Calories"
          value={user?.totalCaloriesBurned || 0}
          unit="cal"
          icon="⚡"
          color="purple"
        />
      </div>

      <div className="charts-section">
        <div className="charts-grid">
          <WeeklyProgressChart />
          {stats.monthlyData.length > 0 && (
            <SimpleBarChart 
              data={stats.monthlyData} 
              title="Monthly Calories Burned"
            />
          )}
        </div>
      </div>

      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">🎯</div>
            <div className="achievement-content">
              <h4>Consistency King</h4>
              <p>Workout 3 days in a row</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '66%' }}></div>
                </div>
                <span>2/3 days</span>
              </div>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-content">
              <h4>Calorie Crusher</h4>
              <p>Burn 1000 calories in a week</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stats.weekCalories / 1000) * 100, 100)}%` }}></div>
                </div>
                <span>{stats.weekCalories}/1000 cal</span>
              </div>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">💪</div>
            <div className="achievement-content">
              <h4>Workout Warrior</h4>
              <p>Complete 10 workouts</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stats.totalWorkouts / 10) * 100, 100)}%` }}></div>
                </div>
                <span>{stats.totalWorkouts}/10 workouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

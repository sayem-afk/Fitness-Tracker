import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Workouts.css';

const Workouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    exercises: [{ name: '', category: 'Cardio', duration: '' }]
  });

  const [exercisesList, setExercisesList] = useState([]);
  const exerciseCategories = ['Strength', 'Cardio', 'Flexibility'];

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exercises');
      setExercisesList(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workouts');
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: '', category: 'Cardio', duration: '' }]
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = newWorkout.exercises.filter((_, i) => i !== index);
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = newWorkout.exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workoutData = {
        exercises: newWorkout.exercises.map(ex => ({
          ...ex,
          duration: parseInt(ex.duration)
        }))
      };

      await axios.post('http://localhost:5000/api/workouts', workoutData);
      
      setNewWorkout({ exercises: [{ name: '', category: 'Cardio', duration: '' }] });
      setShowAddForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h2>My Workouts</h2>
        <button 
          className="add-workout-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Workout'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-workout-form">
          <h3>Add New Workout</h3>
          <form onSubmit={handleSubmit}>
            {newWorkout.exercises.map((exercise, index) => (
              <div key={index} className="exercise-form">
                <div className="exercise-row">
                  <select
                    value={exercise.category}
                    onChange={(e) => updateExercise(index, 'category', e.target.value)}
                    required
                  >
                    {exerciseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    required
                  >
                    <option value="">Select Exercise</option>
                    {exercisesList
                      .filter(ex => ex.category === exercise.category)
                      .map(ex => (
                        <option key={ex._id} value={ex.name}>{ex.name}</option>
                      ))}
                  </select>
                  
                  <input
                    type="number"
                    placeholder="Duration (min)"
                    value={exercise.duration}
                    onChange={(e) => updateExercise(index, 'duration', e.target.value)}
                    required
                    min="1"
                  />
                  
                  {newWorkout.exercises.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExercise(index)}
                      className="remove-exercise-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="form-actions">
              <button type="button" onClick={addExercise} className="add-exercise-btn">
                Add Another Exercise
              </button>
              <button type="submit" className="submit-workout-btn">
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="workouts-list">
        {workouts.length === 0 ? (
          <div className="no-workouts">
            <h3>No workouts recorded yet</h3>
            <p>Start your fitness journey by adding your first workout!</p>
          </div>
        ) : (
          <div className="workouts-grid">
            {workouts.map((workout) => (
              <div key={workout._id} className="workout-card">
                <div className="workout-header">
                  <h4>{formatDate(workout.date)}</h4>
                  <div className="workout-stats">
                    <span className="total-calories">{workout.totalCalories} cal</span>
                    <span className="total-duration">{workout.totalDuration} min</span>
                  </div>
                </div>
                
                <div className="exercises-list">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item">
                      <div className="exercise-info">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-category">{exercise.category}</span>
                      </div>
                      <div className="exercise-stats">
                        <span>{exercise.duration} min</span>
                        <span>{exercise.caloriesBurned} cal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;

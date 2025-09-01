const Workout = require('../models/Workout');
const User = require('../models/User');

// Add new workout
const addWorkout = async (req, res) => {
  try {
    const { exercises } = req.body;
    
    // Calculate calories for each exercise
    const exerciseDatabase = {
      'Push-ups': { caloriesPerMinute: 8 },
      'Squats': { caloriesPerMinute: 6 },
      'Jumping Jacks': { caloriesPerMinute: 10 },
      'Walking': { caloriesPerMinute: 5 },
      'Plank': { caloriesPerMinute: 4 },
      'Lunges': { caloriesPerMinute: 7 },
      'Running': { caloriesPerMinute: 12 },
      'Burpees': { caloriesPerMinute: 15 },
      'Mountain Climbers': { caloriesPerMinute: 11 },
      'Yoga': { caloriesPerMinute: 3 }
    };

    const processedExercises = exercises.map(exercise => {
      const baseCalories = exerciseDatabase[exercise.name]?.caloriesPerMinute || 5;
      return {
        ...exercise,
        caloriesBurned: Math.round(baseCalories * exercise.duration)
      };
    });

    const workout = new Workout({
      user: req.user._id,
      exercises: processedExercises
    });

    await workout.save();

    // Update user's total calories
    const totalWorkoutCalories = workout.totalCalories;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalCaloriesBurned: totalWorkoutCalories }
    });

    res.status(201).json({
      message: 'Workout added successfully',
      workout
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user workouts
const getUserWorkouts = async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', or 'all'
    let dateFilter = {};

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { date: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { date: { $gte: monthAgo } };
    }

    const workouts = await Workout.find({
      user: req.user._id,
      ...dateFilter
    }).sort({ date: -1 });

    res.json({ workouts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get workout statistics
const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Total workouts
    const totalWorkouts = await Workout.countDocuments({ user: userId });
    
    // This week's calories
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekWorkouts = await Workout.find({
      user: userId,
      date: { $gte: weekAgo }
    });
    
    const weekCalories = weekWorkouts.reduce((total, workout) => total + workout.totalCalories, 0);
    
    // Monthly data for chart
    const monthlyData = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalCalories: { $sum: '$totalCalories' },
          totalWorkouts: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalWorkouts,
      weekCalories,
      averageCalories: totalWorkouts > 0 ? Math.round(req.user.totalCaloriesBurned / totalWorkouts) : 0,
      monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addWorkout,
  getUserWorkouts,
  getWorkoutStats
};
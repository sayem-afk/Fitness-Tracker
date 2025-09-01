const Tutorial = require('../models/Tutorial');

// Get all tutorials
const getTutorials = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { equipment: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const tutorials = await Tutorial.find(filter).sort({ featured: -1, views: -1 });
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tutorial by ID
const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    // Increment views
    tutorial.views += 1;
    await tutorial.save();
    
    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new tutorial (Admin only)
const createTutorial = async (req, res) => {
  try {
    const tutorial = new Tutorial(req.body);
    const savedTutorial = await tutorial.save();
    res.status(201).json(savedTutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tutorial (Admin only)
const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.json(tutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tutorial (Admin only)
const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial
};

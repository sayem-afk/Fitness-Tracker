const Gym = require('../models/Gym');

// Get all gyms
const getGyms = async (req, res) => {
  try {
    const { city, search, priceRange } = req.query;
    let filter = {};

    if (city && city !== 'All') {
      filter.city = city;
    }

    if (priceRange && priceRange !== 'All') {
      filter.priceRange = priceRange;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { amenities: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const gyms = await Gym.find(filter).sort({ featured: -1, rating: -1 });
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get gym by ID
const getGymById = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new gym (Admin only)
const createGym = async (req, res) => {
  try {
    const gym = new Gym(req.body);
    const savedGym = await gym.save();
    res.status(201).json(savedGym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update gym (Admin only)
const updateGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete gym (Admin only)
const deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cities
const getCities = async (req, res) => {
  try {
    const cities = await Gym.distinct('city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym,
  getCities
};

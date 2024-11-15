const Car = require('../models/Car');
const fs = require('fs'); // If local file handling is required

exports.createCar = async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map((file) => file.path);

  if (!title || !description || !tags || !images.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const car = new Car({ 
      user: req.user._id, 
      title, 
      description, 
      tags: Array.isArray(tags) ? tags : tags.split(','), 
      images 
    });
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to create car' });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id });
    res.json({ message: 'Cars retrieved successfully', cars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchCars = async (req, res) => {
  const { keyword } = req.query;

  try {
    const cars = await Car.find({
      user: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
      ],
    });
    res.json({ message: 'Cars retrieved successfully', cars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCar = async (req, res) => {
  const { title, description, tags } = req.body;

  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags || car.tags;

    await car.save();
    res.json({ message: 'Car updated successfully', car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete associated files if stored locally
    car.images.forEach((image) => {
      fs.unlink(image, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    });

    await car.remove();
    res.json({ message: 'Car removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

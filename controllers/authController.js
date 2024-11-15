const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Utility function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Utility function to handle errors
const handleError = (res, status, message) => {
  return res.status(status).json({ message });
};

// Register user
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user with the same email or username already exists
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return handleError(res, 400, 'Email already exists');
    }

    if (existingUsername) {
      return handleError(res, 400, 'Username already exists');
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate a token
    const token = generateToken(user._id);

    // Respond with the generated token
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return handleError(res, 500, 'Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return handleError(res, 401, 'Invalid credentials');
    }

    // Compare the entered password with the stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return handleError(res, 401, 'Invalid credentials');
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    // Respond with the token
    res.json({ token });
  } catch (err) {
    console.error(err);
    return handleError(res, 500, 'Server error');
  }
};

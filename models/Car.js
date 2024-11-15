const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The car's unique identifier
 *         user:
 *           type: string
 *           description: The ID of the user who owns the car
 *         title:
 *           type: string
 *           description: The title of the car
 *         description:
 *           type: string
 *           description: The description of the car
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags related to the car
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of image URLs for the car
 */

const CarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],  // Image URLs
  tags: [String],  // e.g., ["SUV", "Toyota", "Dealer1"]
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);

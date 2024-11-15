const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { 
  createCar, 
  getCars, 
  searchCars, 
  updateCar, 
  deleteCar 
} = require('../controllers/carController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware);



// Input validation middleware
const validateCarInput = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('tags').notEmpty().withMessage('Tags are required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The car's unique identifier
 *                 user:
 *                   type: string
 *                   description: The ID of the user who owns the car
 *                 title:
 *                   type: string
 *                   description: The title of the car
 *                 description:
 *                   type: string
 *                   description: The description of the car
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Tags related to the car
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                   description: Array of image URLs for the car
 *       400:
 *         description: Unable to create car
 */
router.post('/', upload.array('images', 10), validateCarInput, createCar);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for the authenticated user
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *       500:
 *         description: Server error
 */
router.get('/', getCars);

/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search cars by title, description, or tags
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in title, description, or tags
 *     responses:
 *       200:
 *         description: A list of matching cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *       500:
 *         description: Server error
 */
router.get('/search', searchCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update car details
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *       404:
 *         description: Car not found
 */
router.put('/:id', upload.array('images', 10), validateCarInput, updateCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car's unique identifier
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.delete('/:id', deleteCar);

module.exports = router;

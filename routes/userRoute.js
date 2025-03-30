// const express = require('express');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');

// const router = express.Router();

// // Test route (unprotected)
// router.get('/test', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'User routes are working'
//   });
// });

// // Current user routes
// router.get('/me', authController.protect, userController.getCurrentUser);
// router.patch('/updateMe', authController.protect, userController.updateCurrentUser);
// router.delete('/deleteMe', authController.protect, userController.deleteCurrentUser);

// // Admin routes
// router.get('/', authController.protect, userController.getAllUsers);
// router.get('/:id', authController.protect, userController.getUserById);
// router.patch('/:id', authController.protect, userController.updateUser);
// router.delete('/:id', authController.protect, userController.deleteUser);

// module.exports = router;


const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Test route (unprotected)
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User routes are working',
  });
});

// Current user routes
router.get('/me', authController.protect, userController.getCurrentUser);
router.patch('/updateMe', authController.protect, userController.updateCurrentUser);
router.delete('/deleteMe', authController.protect, userController.deleteCurrentUser);

// Admin routes
router.get('/', authController.protect, userController.getAllUsers);
router.get('/:id', authController.protect, userController.getUserById);
router.patch('/:id', authController.protect, userController.updateUser);
router.delete('/:id', authController.protect, userController.deleteUser);

module.exports = router; // ✅ Now correctly exporting the router

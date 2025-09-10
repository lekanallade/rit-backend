const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middlewares/middleware.upload');

// Upload both profile picture & ID document
router.post(
  '/signup',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 }
  ]),
  authController.signup
);

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentLog.controller');

// --------------------
// Create a payment (tenant -> owner or owner -> community)
// POST /payments
router.post('/', paymentController.makePayment);

// --------------------
// Get all payments for a property
// GET /payments/property/:propertyId
router.get('/property/:propertyId', paymentController.getPaymentsForProperty);

// --------------------
// Get all payments for a user (as payer or receiver)
// GET /payments/user/:userId
router.get('/user/:userId', paymentController.getPaymentsForUser);

module.exports = router;

const PaymentLog = require('../models/paymentLog.model');
const { Op } = require('sequelize');
const Property = require('../models/property.model');
const User = require('../models/user.model');


// Mark a payment as paid
const moment = require('moment');

exports.makePayment = async (req, res) => {
  try {
    const { propertyId, fromUserId, toUserId, type, amount } = req.body;

    const billingMonth = moment().format('YYYY-MM');

    const paymentLog = await PaymentLog.create({
      propertyId,
      fromUserId,
      toUserId,
      type,
      amount,
      status: 'UNPAID',
      billingMonth
    });

    res.status(201).json(paymentLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all payments for a property
exports.getPaymentsForProperty = async (req, res) => {
  try {
    const logs = await PaymentLog.findAll({
      where: { propertyId: req.params.propertyId },
      include: [
        { model: User, as: 'payer', attributes: ['id', 'firstname', 'givenname'] },
        { model: User, as: 'receiver', attributes: ['id', 'firstname', 'givenname'] }
      ]
    });

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No payment made yet for this property' });
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payments for a user (as payer or receiver)
exports.getPaymentsForUser = async (req, res) => {
  try {
    const logs = await PaymentLog.findAll({
      where: {
        [Op.or]: [
          { fromUserId: req.params.userId },
          { toUserId: req.params.userId }
        ]
      },
      include: [
        { model: User, as: 'payer', attributes: ['id', 'firstname', 'givenname'] },
        { model: User, as: 'receiver', attributes: ['id', 'firstname', 'givenname'] },
        { model: Property }
      ]
    });

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No payment made yet for this user' });
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

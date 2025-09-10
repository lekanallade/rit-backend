// models/paymentLog.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // your sequelize instance
const User = require('./user.model');
const Property = require('./property.model');

// Define the PaymentLog model
const PaymentLog = sequelize.define('PaymentLog', {
  type: {
    type: DataTypes.ENUM('RENT', 'COMMUNITY_FEE'),
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PAID', 'UNPAID'),
    defaultValue: 'UNPAID'
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  billingMonth: {
    type: DataTypes.STRING, // YYYY-MM
    allowNull: false
  }
});

// Define associations
PaymentLog.belongsTo(User, { foreignKey: 'fromUserId', as: 'payer' });
PaymentLog.belongsTo(User, { foreignKey: 'toUserId', as: 'receiver' });
PaymentLog.belongsTo(Property, { foreignKey: 'propertyId' });

module.exports = PaymentLog;

// models/property.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Property = sequelize.define('Property', {
  country: { type: DataTypes.STRING, allowNull: false },
  stateOrCounty: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  detailedLocation: { type: DataTypes.STRING },

  propertyOwnerId: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'id' },
    allowNull: false
  },
  tenantId: { 
    type: DataTypes.INTEGER, 
    references: { model: User, key: 'id' },
    allowNull: true
  },

  rentCost: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  rentPaymentDate: { type: DataTypes.DATEONLY, allowNull: false },
  lastTenantPaymentDate: { type: DataTypes.DATE, allowNull: true },
  lastCommunityPaymentDate: { type: DataTypes.DATEONLY },

  checkStatus: {
  type: DataTypes.ENUM('CHECKIN_PENDING', 'CHECKOUT_PENDING', 'CHECKED_IN', 'CHECKED_OUT','IDLE'),
  allowNull: false,
  defaultValue: 'IDLE'
},


  // Enumerations
  status: {
    type: DataTypes.ENUM('FREE', 'RENTED'),
    allowNull: false,
    defaultValue: 'FREE'
  },
  rentpaymentStatus: {
    type: DataTypes.ENUM('PAID', 'UNPAID'),
    allowNull: false,
    defaultValue: 'UNPAID'
  },

  communityPaymentStatus: {
    type: DataTypes.ENUM('PAID', 'UNPAID'),
    allowNull: false,
    defaultValue: 'UNPAID'
  },


  images: {
    type: DataTypes.JSON, // Store as JSON array
    defaultValue: [],
    validate: {
      maxThreeImages(value) {
        if (value && value.length > 3) {
          throw new Error('Maximum 3 images allowed per property');
        }
      }
    }
  }
}, {
  timestamps: true,
  getterMethods: {
    ritPercent() {
      return 10;
    },
    ritTaxCost() {
      return this.rentCost * 0.1;
    }
  }
});

// Associations
Property.belongsTo(User, { foreignKey: 'propertyOwnerId', as: 'propertyOwner' });
Property.belongsTo(User, { foreignKey: 'tenantId', as: 'tenant' });

module.exports = Property;

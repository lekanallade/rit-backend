const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const User = sequelize.define('User', {
  firstname: { type: DataTypes.STRING, allowNull: false },
  middlename: { type: DataTypes.STRING },
  givenname: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  sex: { type: DataTypes.ENUM('Male', 'Female'), allowNull: false },
  cityOfBirth: { type: DataTypes.STRING },
  profession: { type: DataTypes.STRING },
  maritalStatus: { type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed') },
  detailedAddress: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING, validate: { is: /^\+243\d{9}$/ } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  userType: { type: DataTypes.ENUM('Property Owner', 'Tenant', 'Community Manager'), allowNull: false },
  profilePicture: { type: DataTypes.STRING, allowNull: true },
  idDocument: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },

  // OTP & Verification fields
  emailOtp: { type: DataTypes.STRING, allowNull: true }, // If commented, the code is NULL in the DB
  emailOtpExpires: { type: DataTypes.DATE, allowNull: true }, // If commented, the code is NULL in the DB
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },

  //phoneOtp: { type: DataTypes.STRING, allowNull: true },
  //phoneOtpExpires: { type: DataTypes.DATE, allowNull: true },
  isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },

}, {
  timestamps: true
});

module.exports = User;

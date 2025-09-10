const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rit', 'rit', 'P@WSSRD12528', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Use environment variables for database configuration
const sequelize = new Sequelize(process.env.DB_NAME || 'adoptiondb', process.env.DB_USER || 'dabcaowner', process.env.DB_PASS || 'dabca1234', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false, 
  define: {
    timestamps: false 
  }
});

module.exports = sequelize;

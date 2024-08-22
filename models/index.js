const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/config'); 

// Object to collect models
const db = {};

// Read through the models directory, import all models, and initialize them
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== "index.js") && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply relationships if the model defines an associate method
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach the sequelize instance and the Sequelize class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object, which includes models, sequelize instance, and Sequelize library
module.exports = db;

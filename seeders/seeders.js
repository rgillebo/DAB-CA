const fs = require('fs');
const path = require('path');
const { sequelize, Animal, Species, Temperament, User } = require('../models');

// Loads JSON file and parses its content
const loadJsonFile = (filePath) => {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading JSON file:', error);
    return null;
  }
};

// Inserts data for Users, Animals using raw SQL queries
const insertData = async (filename) => {
  const records = loadJsonFile(path.join(__dirname, '../public/json/', filename)).records;
  for (let record of records) {
    try {
      await sequelize.query(record.query, { type: sequelize.QueryTypes.INSERT });
      console.log(`Inserted record from ${filename}`);
    } catch (error) {
      console.error(`Error inserting record from ${filename}:`, error);
    }
  }
};

// Inserts Temperaments using Sequelize
const insertTemperaments = async () => {
  const records = loadJsonFile(path.join(__dirname, '../public/json/', 'temperaments.json')).records;
  for (let record of records) {
    const descriptionMatch = record.query.match(/VALUES\s+\(\d+,\s*'(.+?)'\)/i);
    if (descriptionMatch) {
      const description = descriptionMatch[1];
      await Temperament.create({ description });
      console.log(`Inserted temperament: ${description}`);
    }
  }
};

// Inserts Species using Sequelize
const insertSpecies = async () => {
  const records = loadJsonFile(path.join(__dirname, '../public/json/', 'species.json')).records;
  for (let record of records) {
    const nameMatch = record.query.match(/VALUES\s+\(\d+,\s*'(.+?)'\)/i);
    if (nameMatch) {
      const name = nameMatch[1];
      await Species.create({ name });
      console.log(`Inserted species: ${name}`);
    }
  }
};

// Associates Animals with Temperaments based on a configuration file
const associateAnimalsAndTemperaments = async () => {
  const associations = loadJsonFile(path.join(__dirname, '../public/json/', 'animalTemperamentAssociations.json')).associations;
  for (let assoc of associations) {
    const animal = await Animal.findByPk(assoc.animalId);
    if (animal) {
      await animal.addTemperaments(assoc.temperamentIds);
      console.log(`Animal ID ${assoc.animalId} associated with temperaments: ${assoc.temperamentIds.join(", ")}.`);
    }
  }
};

// Associates Animals with Species based on a new configuration file
const associateAnimalsWithSpecies = async () => {
  const associations = loadJsonFile(path.join(__dirname, '../public/json/', 'animalSpeciesAssociations.json')).associations;
  for (let { animalId, speciesId } of associations) {
    const animal = await Animal.findByPk(animalId);
    if (animal && await Species.findByPk(speciesId)) {
      await animal.update({ speciesId });
      console.log(`Animal ID ${animalId} associated with species ID: ${speciesId}.`);
    } else {
      console.log(`Invalid association: Animal ID ${animalId} or Species ID ${speciesId} not found.`);
    }
  }
};


// Orchestrates the entire database seeding and association process
const populateDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // As this is a testing environment, this is set to true. In its current form, pressing the "Populate Database" will overwrite new data not present in the static files. 
    console.log('Database synced successfully.');

    await insertData('users.json');
    await insertSpecies(); 
    await insertTemperaments();
    await insertData('animals.json');

    await associateAnimalsAndTemperaments();
    await associateAnimalsWithSpecies(); 

    console.log('Database populated and associations created successfully.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

module.exports = populateDatabase;

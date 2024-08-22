var express = require('express');
var router = express.Router();
const { sequelize, Animal, Species, Temperament, Adoption, User } = require('../models');
const { isMember, isAdmin } = require('../middleware/authMiddleware');
const { Op } = require("sequelize");



// Function to determine user role, defaulting to 'guest' if not logged in
const getUserRole = (req) => {
    if (req.isAuthenticated()) {
      return req.user.role;
    }
    return 'guest';
  };

// Display all animals
router.get('/', async function(req, res, next) {
    try {
        const animals = await Animal.findAll({
            include: [
              { model: Species },
              { model: Temperament }
            ]
        });
        const speciesList = await Species.findAll();
        const userRole = getUserRole(req);
        res.render('animals', { user: req.user, animals, speciesList, userRole });
    } catch (error) {
        next(error);
    }
});

// Handle search query for popular animal names (GET)
router.get('/popularAnimalNames', async (req, res) => {
    try {
        const query = `
            SELECT Animals.name, COUNT(*) AS popularity
            FROM Animals
            GROUP BY Animals.name
            ORDER BY popularity DESC, Animals.name
        `;
        const animals = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        res.json(animals);
    } catch (error) {
        console.error('Error fetching popular animal names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Handle search query for adopted animals (GET)
router.get('/adoptedAnimals', async (req, res) => {
    try {
        const adoptedAnimals = await Animal.findAll({
            where: { adopted: true },
            include: [
              { model: Species },
              { model: Temperament }
            ]
        });

        res.json(adoptedAnimals);
    } catch (error) {
        console.error('Error fetching adopted animals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Handle search query for animals sorted by age (GET)
router.get('/animalsByAge', async (req, res) => {
    try {
        const animals = await Animal.findAll({
            include: [
                { model: Species },
                { model: Temperament }
            ],
            order: sequelize.literal('birthday DESC')
        });

        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals by age:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Handle search query for animals born in a date range (GET)
router.get('/animalsByDateRange', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
       

        const animals = await Animal.findAll({
            where: {
                birthday: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: [
                { model: Species },
                { model: Temperament }
            ],
            order: [['birthday', 'ASC']] 
        });

        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals by date range:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for fetching number of animals per size
router.get('/animalsPerSize', isAdmin, async (req, res) => {
    try {
        const sizes = await Animal.findAll({
            attributes: [
                'size',
                [sequelize.fn('COUNT', sequelize.col('size')), 'numberOfAnimals']
            ],
            group: ['size'],
            raw: true,
        });

        res.json(sizes);
    } catch (error) {
        console.error('Error fetching animals per size:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle animal adoption (POST)
router.post('/adopt/:animalId', isMember, async function (req, res, next) {
    const { animalId } = req.params;
    const userId = req.user.id; 
    try {
        const animal = await Animal.findByPk(animalId);
        if (!animal || animal.adopted) {
            req.flash('error', 'This animal cannot be adopted.');
            return res.redirect('/animals');
        }

        // Update the animal's adopted status
        await animal.update({ adopted: true });

        // Create a new adoption record
        await Adoption.create({
            userId: userId,
            animalId: animalId
        });

        req.flash('success', 'Animal adopted successfully.');
        res.redirect('/animals');
    } catch (error) {
        console.error('Error adopting animal:', error);
        req.flash('error', 'Error adopting animal.');
        res.redirect('/animals');
    }
});

// Handle animal addition (POST)
router.post('/add', isAdmin, async function (req, res, next) {
    const { name, speciesId, birthday, size } = req.body;
    try {
        await Animal.create({ name, speciesId, birthday, size, adopted: false });
        res.redirect('/animals');
    } catch (error) {
        next(error);
    }
});

// Handle animal species update (POST)
router.post('/updateSpecies/:id', isAdmin, async function (req, res, next) {
    const { id } = req.params;
    const { speciesId } = req.body;
    try {
        await Animal.update({ speciesId }, { where: { id } });
        res.redirect('/animals');
    } catch (error) {
        next(error);
    }
});

// Handle canceling an adoption (POST)
router.post('/cancel-adoption/:animalId', isAdmin, async function (req, res, next) {
    const { animalId } = req.params;
    try {
        // Delete the adoption record
        await Adoption.destroy({
            where: { animalId: animalId }
        });

        // Update the animal's adopted status to false
        await Animal.update({ adopted: false }, { where: { id: animalId } });

        req.flash('success', 'Adoption canceled successfully.');
        res.redirect('/animals');
    } catch (error) {
        console.error('Error canceling adoption:', error);
        req.flash('error', 'Error canceling adoption.');
        res.redirect('/animals');
    }
});

module.exports = router;

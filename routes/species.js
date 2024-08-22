var express = require('express');
var router = express.Router();
const { Species, Animal } = require('../models'); 
const { isAdmin } = require('../middleware/authMiddleware');

// GET handler to display species
router.get('/', isAdmin, async function(req, res, next) {
    try {
        const speciesList = await Species.findAll();
        res.render('species', { 
            speciesList: speciesList, 
            user: req.user,
            messages: { success: req.flash('success'), error: req.flash('error') } 
        });
    } catch (error) {
        console.error('Error fetching species:', error);
        req.flash('error', 'Error fetching species.');
        res.redirect('/');
    }
});

// POST handler to add a new species
router.post('/add', isAdmin, async function (req, res, next) {
    const { name } = req.body;
    try {
        await Species.create({ name });
        req.flash('success', 'Species added successfully.');
        res.redirect('/species');
    } catch (error) {
        console.error('Error adding species:', error);
        req.flash('error', 'Error adding species.');
        res.redirect('/species');
    }
});

// POST handler to update an existing species name
router.post('/update/:id', isAdmin, async function (req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await Species.update({ name }, { where: { id } });
        req.flash('success', 'Species updated successfully.');
        res.redirect('/species');
    } catch (error) {
        console.error('Error updating species:', error);
        req.flash('error', 'Error updating species.');
        res.redirect('/species');
    }
});

// POST handler to delete a species - with dependency check
router.post('/delete/:id', isAdmin, async function (req, res, next) {
    const { id } = req.params;
    try {
        const dependentAnimals = await Animal.count({ where: { speciesId: id } });
        if (dependentAnimals > 0) {
            req.flash('error', 'Species cannot be deleted because it has dependent animals.');
            return res.redirect('/species');
        }
        await Species.destroy({ where: { id } });
        req.flash('success', 'Species deleted successfully.');
        res.redirect('/species');
    } catch (error) {
        console.error('Error deleting species:', error);
        req.flash('error', 'Error deleting species.');
        res.redirect('/species');
    }
});

module.exports = router;
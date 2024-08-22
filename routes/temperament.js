var express = require('express');
var router = express.Router();
const { Temperament, Animal } = require('../models');
const { isAdmin } = require('../middleware/authMiddleware');

// GET handler to display temperaments
router.get('/', isAdmin, async function(req, res, next) {
    try {
        const temperamentList = await Temperament.findAll({
            order: [['id', 'ASC']]
        });
        res.render('temperament', {
            temperamentList,
            user: req.user,
            messages: { success: req.flash('success'), error: req.flash('error') }
        });
    } catch (error) {
        console.error('Error fetching temperaments:', error);
        req.flash('error', 'Problem fetching temperaments.');
        res.redirect('/');
    }
});

// POST handler to add a new temperament
router.post('/add', isAdmin, async function(req, res, next) {
    const { description } = req.body;
    try {
        await Temperament.create({ description });
        req.flash('success', 'Temperament added successfully.');
        res.redirect('/temperament');
    } catch (error) {
        console.error('Error adding temperament:', error);
        req.flash('error', 'Error adding temperament.');
        res.redirect('/temperament');
    }
});

// POST handler to update an existing temperament
router.post('/update/:id', isAdmin, async function(req, res, next) {
    const { id } = req.params;
    const { description } = req.body;
    try {
        await Temperament.update({ description }, { where: { id } });
        req.flash('success', 'Temperament updated successfully.');
        res.redirect('/temperament');
    } catch (error) {
        console.error('Error updating temperament:', error);
        req.flash('error', 'Error updating temperament.');
        res.redirect('/temperament');
    }
});

// POST handler to delete a temperament - with dependency check
router.post('/delete/:id', isAdmin, async function(req, res, next) {
    const { id } = req.params;
    try {
        const temperament = await Temperament.findByPk(id, {
            include: [{
                model: Animal,
                as: 'Animals',
                through: { attributes: [] },
                required: false
            }]
        });

        if (temperament && temperament.Animals && temperament.Animals.length > 0) {
            req.flash('error', 'Temperament cannot be deleted because it is in use.');
            return res.redirect('/temperament');
        }

        await Temperament.destroy({ where: { id } });
        req.flash('success', 'Temperament deleted successfully.');
        res.redirect('/temperament');
    } catch (error) {
        console.error('Error deleting temperament:', error);
        req.flash('error', 'Error deleting temperament.');
        res.redirect('/temperament');
    }
});

module.exports = router;

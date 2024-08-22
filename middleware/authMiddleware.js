const flash = require('connect-flash');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access that page.');
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Access Denied: You do not have admin privileges.');
    res.redirect('/login');
}

function isMember(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'member') {
        return next();
    }
    req.flash('error', 'Access Denied: You do not have member access.');
    res.redirect('/login');
}

module.exports = { isLoggedIn, isAdmin, isMember };

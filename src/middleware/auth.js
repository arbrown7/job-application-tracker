import {
    getJobOwner
} from '../models/jobs/jobs.js';

/**
 * Middleware to require authentication for protected routes.
 * Redirects to login page if user is not authenticated.
 * Sets res.locals.isLoggedIn = true for authenticated requests.
 */
const requireLogin = (req, res, next) => {
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        next();
    } else {
        // User is not authenticated - redirect to login
        res.redirect('/login');
    }
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {...string} roles - One or more role names required (e.g., 'admin', 'job_seeker')
 * @returns {Function} Express middleware function
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (!roles.includes(req.session.user.roleName)) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

const requireAdminOrOwner = async (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    
    const isAdmin = req.session.user.roleName === 'admin';
    if (isAdmin) return next();

    try {
        const jobOwner = await getJobOwner(req.params.id);
        if (!jobOwner) {
            req.flash('error', 'Job not found');
            return res.redirect('/');
        }

        const isOwner = req.session.user.user_id === jobOwner.owner_user_id;
        if (isOwner) return next();
    } catch (err) {
        return next(err);
    }

    req.flash('error', 'You do not have permission to access this page');
    return res.redirect('/');
};

export { requireLogin, requireRole, requireAdminOrOwner };
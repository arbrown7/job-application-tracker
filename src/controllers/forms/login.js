import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';

/**
 * Display the login form.
 */
const showLoginForm = (req, res) => {
        res.render('forms/login/form', {
        title: 'User Login'
    });
};

/**
 * Process login form submission.
 */
const processLogin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        let user = await findUserByEmail(email);
        if (!user) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        let verifiedPassword = await verifyPassword(password, user.password);
        if (!verifiedPassword) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }
        // SECURITY: Remove password from user object before storing in session
        delete user.password;

        req.session.user = user;
        req.flash('success', 'Welcome ' + user.first_name + '!')
        return res.redirect('/dashboard');
    } catch (error) {
        // Model functions do not catch errors, so handle them here
        console.error('Invalid email or password', error);
        req.flash('error', 'Unable to login. Please try again later.')
        return res.redirect('/login');
    }
};

/**
 * Handle user logout.
 * 
 * NOTE: connect.sid is the default session cookie name since we did not
 * specify a custom name when creating the session in server.js.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);

            res.clearCookie('connect.sid');

            return res.redirect('/');
        }
        
        res.clearCookie('connect.sid');

        return res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login).
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Security check! Ensure user and sessionData do not contain password field
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

        res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

export { 
    showLoginForm,
    processLogin,
    processLogout, 
    showDashboard 
};
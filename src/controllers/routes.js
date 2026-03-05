import { Router } from 'express';
import { homePage } from './index.js';
import { requireLogin, requireRole } from '../middleware/auth.js';
import { 
    processLogout, 
    showDashboard, 
    processLogin,
    showLoginForm  
} from './forms/login.js';
import {
    registrationValidation, 
    loginValidation,
    updateAccountValidation
} from '../middleware/validation/forms.js'
import {
    showRegistrationForm, 
    processRegistration,
    showAllUsers,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount
} from './forms/registration.js';

const router = Router();

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles to all login routes
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Homepage routes
router.get('/', homePage);


// Login routes (form and submission)
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);

// Authentication-related routes at root level
router.get('/dashboard', requireLogin, showDashboard);
router.get('/logout', processLogout);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', showAllUsers);
router.get('/register/:id/edit', requireRole('admin'), showEditAccountForm);
router.post('/register/:id/edit', requireRole('admin'), updateAccountValidation, processEditAccount);
router.post('/register/:id/delete', requireRole('admin'), processDeleteAccount);

export default router;
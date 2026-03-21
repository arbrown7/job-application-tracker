import { Router } from 'express';
import { homePage } from './index.js';
import { 
    requireLogin, 
    requireRole,
    requireAdminOrOwner 
} from '../middleware/auth.js';
import { 
    processLogout, 
    showDashboard, 
    processLogin,
    showLoginForm  
} from './forms/login.js';
import {
    registrationValidation, 
    loginValidation,
    updateAccountValidation,
    jobValidation,
    jobEditValidation,
    suggestionValidation
} from '../middleware/validation/forms.js'
import {
    showRegistrationForm, 
    processRegistration,
    showAllUsers,
    showUser,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount
} from './forms/registration.js';
import { 
    jobsPage,
    showNewJobForm,
    processNewJob,
    showEditJobForm,
    processEditJob,
} from './jobs/jobs.js';
import { 
    showSuggestionForm,
    processSuggestion
} from './jobs/suggestions.js';

const router = Router();

// Add specific styles to home page
router.use('/', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/home.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add jobs-specific styles to all jobs routes
router.use('/jobs', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/jobs.css">');
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
router.get('/dashboard', requireRole('job_seeker'), showDashboard);
router.get('/logout', processLogout);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', showAllUsers);
router.get('/registration/profile', requireLogin, showUser);
router.get('/register/:id/edit', requireAdminOrOwner, showEditAccountForm);
router.post('/register/:id/edit', requireAdminOrOwner, updateAccountValidation, processEditAccount);
router.post('/register/:id/delete', requireRole('admin'), processDeleteAccount);

// Job routes
router.get('/jobs', requireRole('job_seeker'), jobsPage);
router.get('/jobs/new', requireRole('job_seeker'), showNewJobForm);
router.post('/jobs/new', requireRole('job_seeker'), jobValidation, processNewJob);
router.get('/jobs/suggestion', requireRole('supporter'), showSuggestionForm);
router.post('/jobs/suggestion', requireRole('supporter'), suggestionValidation, processSuggestion);
router.get('/jobs/:id/edit', requireRole('job_seeker'), showEditJobForm);
router.post('/jobs/:id/edit', requireRole('job_seeker'), jobEditValidation, processEditJob);
//router.post('/jobs/:id/delete');

// Company routes
//router.get('/companies', companiesPage); //shows current user's companies

export default router;
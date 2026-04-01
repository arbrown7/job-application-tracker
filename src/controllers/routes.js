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
    suggestionValidation,
    itemValidation
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
    processDeleteJob,
    processApproveJob
} from './jobs/jobs.js';
import { 
    showSuggestionForm,
    processSuggestion
} from './jobs/suggestions.js';
import {
    showAdminPage,
    processAddItem
} from './admin/admin.js';

const router = Router();

// Add specific styles to home page
router.use((req, res, next) => {
    if (req.path === '/') {
        res.addStyle('<link rel="stylesheet" href="/css/home.css">');
    }
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

// Authentication-related routes
router.get('/dashboard', requireRole('job_seeker', 'admin'), showDashboard);
router.get('/logout', processLogout);
router.get('/admin', requireRole('admin'), showAdminPage);
router.post('/admin/:item/add', itemValidation, requireRole('admin'), processAddItem);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', showAllUsers);
router.get('/registration/profile', requireLogin, showUser);
router.get('/register/:id/edit', requireLogin, showEditAccountForm);
router.post('/register/:id/edit', requireLogin, updateAccountValidation, processEditAccount);
router.post('/register/:id/delete', requireRole('admin'), processDeleteAccount);

// Job routes
router.get('/jobs', requireRole('job_seeker', 'admin'), jobsPage);
router.get('/jobs/new', requireRole('job_seeker', 'admin'), showNewJobForm);
router.post('/jobs/new', requireRole('job_seeker', 'admin'), jobValidation, processNewJob);
router.get('/jobs/suggestion', requireRole('supporter', 'admin'), showSuggestionForm);
router.post('/jobs/suggestion', requireRole('supporter', 'admin'), suggestionValidation, processSuggestion);
router.get('/jobs/:id/edit', requireAdminOrOwner, showEditJobForm);
router.post('/jobs/:id/edit', requireAdminOrOwner, jobEditValidation, processEditJob);
router.post('/jobs/:id/delete', requireAdminOrOwner, processDeleteJob);
router.post('/jobs/:id/approve', requireAdminOrOwner, processApproveJob);

export default router;
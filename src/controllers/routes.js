import { Router } from 'express';
import { homePage } from './index.js';
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

const router = Router();

router.get('/', homePage);

// Login routes (form and submission)
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);

export default router;
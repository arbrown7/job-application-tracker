import { body } from 'express-validator';
import { getAllJobTypes } from '../../models/jobs/jobs.js';
/**
 * Validation rules for login form
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
];

/**
 * Validation rules for editing user accounts
 */
const updateAccountValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long')
];

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Validation rules for submitting a job
 */
const jobValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Title must be between 2 and 255 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('Title contains invalid characters'),
    body('url')
        .notEmpty()
        .withMessage('URL is required')
        .isURL({require_protocol: true})
        .withMessage('Must be a valid URL'),
    body('company')
        .notEmpty()
        .withMessage('Company is required')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Company must be between 2 and 255 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('Company contains invalid characters'),
    body('city')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('City contains invalid characters'),
    body('state')
        .isLength({ min: 2, max: 2 })
        .withMessage('Must be a valid state'),
    body('contactName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Contact came must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Contact name can only contain letters, spaces, hyphens, and apostrophes'),
    body('contactEmail')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Contact email address is too long'),
    body('salaryMin')
        .trim()
        .isInt({min: 0, max: 999999999})
        .withMessage('Must be a integer number'), 
    body('salaryMax')
        .trim()
        .isInt({min: 0, max: 999999999})
        .withMessage('Must be a integer number'),
    body('jobType')
        .notEmpty()
        .withMessage('Job type is required.')
        .isInt({min: 1})
        .custom( async (value) => {
            //AI was used to help create this function
            const types = await getAllJobTypes();
            const validTypeIds = types.map(type => String(type.type_id));

            if (!validTypeIds.includes(String(value))) {
                throw new Error('Selected job type does not exist.');
            }

            return true;
        }),
    body('postDate')
        .isDate()
        .withMessage('Must be a valid date.')
];

export { 
    registrationValidation, 
    loginValidation,
    updateAccountValidation,
    jobValidation
};
import { validationResult } from 'express-validator';
import { getAllJobTypes } from '../../models/jobs/jobs.js';

/**
 * Display the job form used by job seekers.
 */
const showNewJobForm = async (req, res) => {
    try {
        const types = await getAllJobTypes();

        return res.render('jobs/new', {
            title: 'Log a Job Posting',
            types
        });
    } catch (error) {
        console.error('Error loading job form:', error);
        return res.status(500).render('errors/500', {
            title: 'Server Error'
        });
    }
};

/**
 * Process new job form submission.
 */
//TODO: FINISH THIS FUNCTION
const processNewJob = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/jobs');
    }

    // Extract validated data
    const { subject, message } = req.body;

    try {
        // Save to database
        await createContactForm(subject, message);
        // After successfully saving to the database
        req.flash('success', 'Thank you for contacting us! We will respond soon.');
        // Redirect to responses page on success
        return res.redirect('/contact');
    } catch (error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        return res.redirect('/contact');
    }   
};

/**
 * Display the form used by supporters to send job suggestions.
 */
const showSuggestionForm = (req, res) => {
    res.render('forms/jobs/form', {
        title: 'Send a Job Posting'
    });
};

/**
 * Process suggestion form submission.
 */
const processSuggestion = async (req, res) => {

};

export { 
    showNewJobForm,
    processNewJob,
    showSuggestionForm, 
    processSuggestion 
};
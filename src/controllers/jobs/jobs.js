import { validationResult } from 'express-validator';
import { getAllJobs, getAllJobTypes, createJob } from "../../models/jobs/jobs.js";

/**
 * Display the job form used by job seekers.
 */
const showNewJobForm = async (req, res) => {
    try {
        const types = await getAllJobTypes();

        return res.render('jobs/form', {
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
 * Display a list of all jobs
 */
const jobsPage = async (req, res) => {
    const userId = req.session.user.user_id;

    const sortBy = req.query.sort || 'last_changed';

    const jobs = await getAllJobs(userId, sortBy);
    
    res.render('jobs/list', {
        title: 'All Jobs',
        jobs: jobs,
        currentSort: sortBy
    });
};

/**
 * Process new job form submission.
 */
const processNewJob = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('it failed...');
        errors.array().forEach(error => {
            console.log(error.msg);
            req.flash('error', error.msg);
        });
        return res.redirect('/jobs/new');
    }

    // Extract validated data
    const jobInput = { 
        userId: req.session.user.user_id,
        title: req.body.title,
        url: req.body.url,
        company: req.body.company,
        city: req.body.city || null,
        state: req.body.state || null,
        contactName: req.body.contactName || null,
        contactEmail: req.body.contactEmail || null,
        minSalary: req.body.minSalary || null,
        maxSalary: req.body.maxSalary || null,
        datePosted: req.body.postDate || null,
        type: req.body.jobType
    };

    try {
        // Save to database
        const createdJob = await createJob(jobInput);
        // After successfully saving to the database
        req.flash('success', 'Job created');
        // Redirect to confirmation page on success
        return res.redirect('/jobs');
    } catch (error) {
        console.error('Error saving job', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        return res.redirect('/job/new');
    }   
};

/**
 * Display the form used by supporters to send job suggestions.
 */
const showSuggestionForm = (req, res) => {
    res.render('jobs/form', {
        title: 'Send a Job Posting'
    });
};

/**
 * Process suggestion form submission.
 */
const processSuggestion = async (req, res) => {

};

export { 
    jobsPage,
    showNewJobForm,
    processNewJob,
    showSuggestionForm, 
    processSuggestion 
};
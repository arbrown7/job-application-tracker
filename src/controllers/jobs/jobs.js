import { validationResult } from 'express-validator';
import { 
    getAllJobs, 
    getAllJobTypes, 
    createJob, 
    getJobById, 
    getJobOwner,
    updateJob,
    getAllJobStatuses,
    getSuggestionId
} from "../../models/jobs/jobs.js";
import {
    getUserIdByEmail
} from "../../models/forms/registration.js"

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
    res.render('jobs/suggestion', {
        title: 'Send a Job Posting'
    });
};

/**
 * Process suggestion form submission.
 */
const processSuggestion = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            console.log(error.msg);
            req.flash('error', error.msg);
        });
        return res.redirect('/jobs/new');
    }

    const suggestion = await getSuggestionId();
    const email = req.body.seekerEmail;

    // Extract validated data
    const jobInput = { 
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
        type: suggestion
    };

    try {
        let emailInDB = await emailExists(email);
        let seekerId = null;

        if (emailInDB) {
            seekerId = await getUserIdByEmail();
        }  else {
            req.flash('error', 'Error sending suggestion');
            return res.redirect('/');
        }       

        const createdJob = await createJob({
             ...jobInput, 
             userId: seekerId 
            });

        req.flash('success', 'Suggestion created');
        return res.redirect('/');
    } catch (error) {
        console.error('Error saving suggestion', error);
        req.flash('error', 'Unable to submit your suggestion. Please try again later.');
        return res.redirect('/');
    }
};

/**
 * Display the edit job form prefilled with job's information
 */
const showEditJobForm = async (req, res) => {
    const targetJobId = parseInt(req.params.id);
    const currentUser = req.session.user;

    const targetJob = await getJobById(targetJobId);

    if (!targetJob) {
        req.flash('error', 'Job not found.');
        return res.redirect('/jobs');
    }
    
    const targetJobOwner = await getJobOwner(targetJobId);
    const canEdit = currentUser.user_id === targetJobOwner.owner_user_id;
    let types = await getAllJobTypes();
    let statuses = await getAllJobStatuses();

    if (!canEdit) {
        req.flash('error', 'You do not have permission to edit this job.');
        return res.redirect('/jobs');
    }

    res.render('jobs/edit', {
        title: 'Edit Job',
        job: {
            ...targetJob,
            datePosted: targetJob.datePosted ? targetJob.datePosted.toISOString().split('T')[0] : ''
        },
        targetJobId: targetJobId,
        types: types,
        statuses: statuses
    });
};

/**
 * Process job edit form submission
 */

const processEditJob = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/jobs/${req.params.id}/edit`);
    }

    const targetJobId = parseInt(req.params.id);
    const currentUser = req.session.user;
    
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
        type: req.body.jobType,
        status: req.body.jobStatus
    };

    try {
        const targetJob = await getJobById(targetJobId);

        if (!targetJob) {
            req.flash('error', 'Job not found.');
            return res.redirect('/');
        }

        const targetJobOwner = await getJobOwner(targetJobId);
        const canEdit = currentUser.user_id === targetJobOwner.owner_user_id;

        if (!canEdit) {
            req.flash('error', 'You do not have permission to edit this job.');
            return res.redirect('/jobs');
        }

        await updateJob(jobInput, targetJobId);

        req.flash('success', 'Job updated successfully.');
        return res.redirect('/jobs');
    } catch (error) {
        console.error('Error updating job:', error);
        req.flash('error', 'An error occurred while updating the job.');
        return res.redirect(`/jobs`);
    }
};

/**
 * Process job deletion
 */
//TODO: Fix this function
const processDeleteJob = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Only admins can delete accounts
    if (currentUser.roleName !== 'admin') {
        req.flash('error', 'You do not have permission to delete accounts.');
        return res.redirect('/register/list');
    }

    // Prevent admins from deleting their own account
    if (currentUser.id === targetUserId) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/register/list');
    }

    try {
        const deleted = await deleteUser(targetUserId);

        if (deleted) {
            req.flash('success', 'User account deleted successfully.');
        } else {
            req.flash('error', 'User not found or already deleted.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'An error occurred while deleting the account.');
    }

    return res.redirect('/register/list');
};

export { 
    jobsPage,
    showNewJobForm,
    processNewJob,
    showSuggestionForm, 
    showEditJobForm,
    processSuggestion,
    processEditJob,
    processDeleteJob 
};
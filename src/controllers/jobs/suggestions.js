import { validationResult } from 'express-validator';
import { 
    createJob,
    getSuggestionId
} from "../../models/jobs/jobs.js";
import {
    getUserIdByEmail,
    emailExists
} from "../../models/forms/registration.js"

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
            seekerId = await getUserIdByEmail(email);
        }  else {
            req.flash('error', 'Error sending suggestion');
            return res.redirect('/');
        }       

        const createdJob = await createJob({
             ...jobInput, 
             userId: seekerId 
            });

        req.flash('success', 'Suggestion sent!');
        return res.redirect('/');
    } catch (error) {
        console.error('Error saving suggestion', error);
        req.flash('error', 'Unable to submit your suggestion. Please try again later.');
        return res.redirect('/');
    }
};

export { 
    showSuggestionForm,
    processSuggestion
};
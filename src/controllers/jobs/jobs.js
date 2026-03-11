import { getAllJobs } from "../../models/jobs/jobs.js";

const jobsPage = async (req, res) => {
    const userId = req.session.user.user_id;

    const sortBy = req.query.sort || 'last_changed';

    const jobs = await getAllJobs(userId, sortBy);
    
    res.render('forms/jobs/list', {
        title: 'All Jobs',
        jobs: jobs,
        currentSort: sortBy
    });
};

export {jobsPage};
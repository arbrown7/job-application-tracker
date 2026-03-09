import { getAllJobs } from "../../models/jobs/jobs";

const jobsPage = async (req, res) => {
    // For reference
    // id: job.id,
    // title: job.title,
    // city: job.city,
    // state: job.state,
    // minSalary: job.salary_min,
    // maxSalary: job.salary_max,
    // datePosted: job.posted_date,
    // lastChanged: job.last_changed,
    // status: job.status,
    // type: job.type
    const userId = req.session.user.user_id;

    const sortBy = req.query.sort || 'last_changed';

    const jobs = await getAllJobs(userId, sortBy);
    
    res.render('catalog/list', {
        title: 'Course Catalog',
        jobs: jobs
    });
};

export {jobsPage};
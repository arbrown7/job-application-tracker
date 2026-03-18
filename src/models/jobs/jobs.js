import db from '../db.js';

const getAllJobStatuses = async () => {
    const query = `
        SELECT ALL status_id, name
        FROM job_status
        ORDER BY status_id;
    `;

    const result = await db.query(query);

    return result.rows.map(status => ({
        id: status.status_id,
        name: status.name
    }));
};

const getAllJobTypes = async () => {
    const query = `
        SELECT ALL type_id, name
        FROM job_type
        ORDER BY type_id;
    `;

    const result = await db.query(query);

    return result.rows.map(type => ({
        id: type.type_id,
        name: type.name
    }));
};

const getJobById = async (jobId) => {
    const query = `
        SELECT 
            jobs.job_id,
            jobs.title,
            jobs.company,
            jobs.url,
            jobs.city,
            jobs.state,
            jobs.contact_name as "contactName",
            jobs.contact_email as "contactEmail",
            jobs.salary_min as "minSalary",
            jobs.salary_max as "maxSalary",
            jobs.status_id as "status",
            jobs.type_id as "type",
            jobs.posted_date as "datePosted",
            jobs.created_at as "dateCreated",
            jobs.last_changed as "lastChanged"
        FROM jobs
        WHERE jobs.job_id = $1
    `;
    const result = await db.query(query, [jobId]);
    return result.rows[0] || null;
};

const getJobOwner = async (jobId) => {
    const query = `
        SELECT jobs.owner_user_id
        FROM jobs
        WHERE jobs.job_id = $1
    `;
    const result = await db.query(query, [jobId]);
    return result.rows[0] || null;
};

const getAllJobs = async (userId, sortBy = 'lastChanged') => {
    const orderByClause =
        sortBy === 'title' ? 'j.title' :
        sortBy === 'state' ? 'j.state' :
        sortBy === 'status' ? 'js.name' :
        sortBy === 'type' ? 'jt.name' :
        sortBy === 'datePosted' ? 'j.posted_date' :
        'j.last_changed';
    
    const query = `
        SELECT
            j.job_id,
            j.title,
            j.company,
            j.url,
            j.city,
            j.state,
            j.salary_min,
            j.salary_max,
            TO_CHAR(j.posted_date, 'MM/DD/YY') AS posted_date,
            TO_CHAR(j.last_changed, 'MM/DD/YY') AS last_changed,
            js.name AS status,
            jt.name AS type
        FROM jobs j
        JOIN job_status js
            ON j.status_id = js.status_id
        JOIN job_type jt
            ON j.type_id = jt.type_id
        WHERE j.owner_user_id = $1
        ORDER BY ${orderByClause};
    `;
    
    const result = await db.query(query, [userId]);
   
    return result.rows.map(job => ({
        id: job.job_id,
        title: job.title,
        company: job.company,
        shortenedUrl: shortenUrl(job.url),
        url: job.url,
        city: job.city,
        state: job.state,
        minSalary: job.salary_min,
        maxSalary: job.salary_max,
        datePosted: job.posted_date,
        lastChanged: job.last_changed,
        status: job.status,
        type: job.type
    }));
};

const createJob = async (job) => {
    const query = `
        INSERT INTO jobs (
            owner_user_id,
            title,
            url,
            company,
            city,
            state,
            contact_name,
            contact_email,
            salary_min,
            salary_max,
            posted_date,
            type_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
    `;
    const result = await db.query(query, [ 
            job.userId,
            job.title,
            job.url,
            job.company, 
            job.city, 
            job.state,
            job.contactName,
            job.contactEmail, 
            job.minSalary, 
            job.maxSalary,
            job.datePosted,
            job.type
    ]);
    return result.rows[0];
};

const updateJob = async (job, jobId) => {
        const query = `
        UPDATE jobs
        SET
            title = $1,
            url = $2,
            company = $3,
            city = $4,
            state = $5,
            contact_name = $6,
            contact_email = $7,
            salary_min = $8,
            salary_max = $9,
            posted_date = $10,
            type_id = $11,
            status_id = $12,
            last_changed = CURRENT_TIMESTAMP
        WHERE jobs.job_id = $13
        RETURNING *
    `;
    const result = await db.query(query, [ 
            job.title,
            job.url,
            job.company, 
            job.city, 
            job.state,
            job.contactName,
            job.contactEmail, 
            job.minSalary, 
            job.maxSalary,
            job.datePosted,
            job.type,
            job.status,
            jobId
    ]);
    return result.rows[0];
};

function shortenUrl(url) {
    url = url.substring(0,20);
    let shortenedUrl = url + '...'
    return shortenedUrl;
};

const getSuggestionId = async () => {
    const types = await getAllJobTypes();
    for( let i = 0; i < types.length; i++) {
        if (types[i].name.toUpperCase() === "SUGGESTION"){
            return types[i].id;
        }
    };
};

export {
    getAllJobStatuses, 
    getAllJobTypes, 
    getAllJobs, 
    createJob, 
    getJobById, 
    getJobOwner,
    updateJob,
    getSuggestionId
};
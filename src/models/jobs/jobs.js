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

/**
 * Get all courses from the database with optional sorting.
 * 
 * @param {integer} userId - id of the user requesting all jobs
 * @param {string} sortBy - Sort option: 
 *                              'last_changed' (default), 
 *                              'title', 
 *                              'company', 
 *                              'state', 
 *                              'salary_min', 
 *                              'salary_max', 
 *                              'status', 
 *                              'type', 
 *                              'posted_date
 * @returns {Promise<Array>} Array of job objects
 */
const getAllJobs = async (userId, sortBy = 'last_changed') => {
    const orderByClause =
        sortBy === 'title' ? 'j.title' :
        sortBy === 'company' ? 'c.name' :
        sortBy === 'state' ? 'j.state' :
        sortBy === 'salary_min' ? 'j.salary_min' :
        sortBy === 'salary_max' ? 'j.salary_max' :
        sortBy === 'status' ? 'js.name' :
        sortBy === 'type' ? 'jt.name' :
        sortBy === 'posted_date' ? 'j.posted_date' :
        'j.last_changed';
    
    const query = `
        SELECT
            j.job_id,
            j.title,
            j.city,
            j.state,
            j.salary_min,
            j.salary_max,
            j.posted_date,
            j.last_changed,
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
        id: job.id,
        title: job.title,
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

export {getAllJobStatuses, getAllJobTypes, getAllJobs, createJob};
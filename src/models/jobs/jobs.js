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
            TO_CHAR(j.posted_date, 'DD/MM/YY') AS posted_date,
            TO_CHAR(j.last_changed, 'DD/MM/YY') AS last_changed,
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

function shortenUrl(url) {
    url = url.substring(0,20);
    let shortenedUrl = url + '...'
    return shortenedUrl;
}

export {getAllJobStatuses, getAllJobTypes, getAllJobs, createJob};
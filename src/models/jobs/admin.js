import db from '../db.js';

const addItem = async (item, name) => {
    const table = item === 'type' ? 'job_type' : 'job_status';
    
    const query = `
        INSERT INTO ${table} (name)
        VALUES ($1)
        RETURNING *
    `;
    const result = await db.query(query, [name]);
    return result.rows[0] || null;
}

export { addItem }
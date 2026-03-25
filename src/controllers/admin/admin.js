import {
    getAllJobStatuses,
    getAllJobTypes
} from '../../models/jobs/jobs.js';
import {
    addItem
} from '../../models/jobs/admin.js';

const showAdminPage = async (req, res) => {
    try {
        const types = await getAllJobTypes();
        const statuses = await getAllJobStatuses();
        
        res.render('admin', {
            title: 'Admin Dashboard',
            types,
            statuses
        });

    } catch (error) {
        console.error('Error loading admin page', error);
        return res.status(500).render('errors/500', {
            title: 'Server Error'
        });
    }
};

const processAddItem = async (req, res) => {
    const item = req.params.item;
    const name = req.body.name;

    try {
        const createdItem = await addItem(item, name);
        req.flash('success', 'Item created');
        return res.redirect('/admin');
    } catch (error) {
        console.error('Error adding item job', error);
        req.flash('error', 'Unable to add item. Please try again later.');
        return res.redirect('/admin');
    }
}

export {
    showAdminPage,
    processAddItem,
};
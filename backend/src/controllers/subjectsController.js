const pool = require('../db/pool');

async function createSubject(req, res, next) {
    const subjectInfo = req.body;

    const queryText = 'INSERT INTO subjects (user_id, name) VALUES ($1, $2) RETURNING *';
    const values = [req.user.id, subjectInfo.name];

    try {
        const result = await pool.query(queryText, values);
        console.log('Subject created successfully: ', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function getSubject(req, res, next) {
    const user_id = req.user.id;

    const queryText = 'SELECT * FROM subjects WHERE user_id = $1';
    const values = [user_id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send('No subjects found for user');
            return;
        }

        console.log(`Fetched subjects under user_id ${user_id}: `, result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

async function editSubject(req, res, next) {
    const id = req.params.id;
    const user_id = req.user.id;
    const newInfo = req.body;

    const queryText = 'UPDATE subjects SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    const values = [newInfo.name, id, user_id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`Subject with id ${id} not found`);
            return;
        }

        console.log(`Name of subject with id ${id} updated to ${newInfo.name}`);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function deleteSubject(req, res, next) {
    const id = req.params.id;
    const user_id = req.user.id;

    const queryText = 'DELETE FROM subjects WHERE id = $1 AND user_id = $2';
    const values = [id, user_id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`Subject with id ${id} not found`);
            return;
        }

        console.log(`Deleted subject with id ${id}`);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createSubject: createSubject,
    getSubject: getSubject,
    editSubject: editSubject,
    deleteSubject: deleteSubject
};
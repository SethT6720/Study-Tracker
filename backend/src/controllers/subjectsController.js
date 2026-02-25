const pool = require('../db/pool');

async function createSubject(req, res) {
    const subjectInfo = req.body;

    const queryText = 'INSERT INTO subjects (user_id, name) VALUES ($1, $2) RETURNING *';
    const values = [subjectInfo.user_id, subjectInfo.name];

    try {
        const result = await pool.query(queryText, values);
        console.log('Subject created successfully: ', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

async function getSubject(req, res) {
    const user_id = req.params.user_id;

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
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

async function editSubject(req, res) {
    const id = req.params.id;
    const newInfo = req.body;

    const queryText = 'UPDATE subjects SET name = $1 WHERE id = $2 RETURNING *';
    const values = [newInfo.name, id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`Subject with id ${id} not found`);
            return;
        }

        console.log(`Name of subject with id ${id} updated to ${newInfo.name}`);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

async function deleteSubject(req, res) {
    const id = req.params.id;

    const queryText = 'DELETE FROM subjects WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`Subject with id ${id} not found`);
            return;
        }

        console.log(`Deleted subject with id ${id}`);
        res.status(204)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createSubject: createSubject,
    getSubject: getSubject,
    editSubject: editSubject,
    deleteSubject: deleteSubject
};
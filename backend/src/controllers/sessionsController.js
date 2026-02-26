const pool = require('../db/pool');

async function createSession(req, res, next) {
    const sessionInfo = req.body;

    const queryText = 'INSERT INTO study_sessions (user_id, subject_id, start_time, duration, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [req.user.id, sessionInfo.subject_id, sessionInfo.start_time, sessionInfo.duration, sessionInfo.notes];

    try {
        const result = await pool.query(queryText, values);
        console.log('Session created successfully: ', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function getSessions(req, res, next) {
    const user_id = req.user.id;

    const queryText = 'SELECT * FROM study_sessions WHERE user_id = $1';
    const values = [user_id];

    try {
        const result = await pool.query(queryText, values);
        
        if (result.rowCount === 0) {
            res.status(404).send(`Sessions under user_id ${user_id} not found`);
            return;
        }

        console.log(`Found ${result.rowCount} session(s) under user_id ${user_id}: `, result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

async function editSession(req, res, next) {
    const info = req.body;
    const user_id = req.user.id;
    const editId = req.params.id;

    let queryText = "UPDATE study_sessions SET";
    let values = [];

    const keys = Object.keys(info);
    for (const key of keys) {
        values.push(info[key]);
        if (values.length > 1) {
            queryText += ',';
        }
        queryText += ` ${key} = $${values.length}`;
    }

    values.push(editId, user_id);
    queryText += ` WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`;
    
    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`Session with id ${editId} not found`);
            return
        }

        console.log('Session edited succcessfully: ', result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function deleteSession(req, res, next) {
    const id = req.params.id;
    const user_id = req.user.id;

    const queryText = 'DELETE FROM study_sessions WHERE id = $1 AND user_id = $2';
    const values = [id, user_id];

    try {
        const result = await pool.query(queryText, values);
        
        if (result.rowCount === 0) {
            res.status(404).send(`Session with id ${id} not found`);
            return;
        }

        console.log(`Session with id ${id} deleted successfully`);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports =  {
    createSession: createSession,
    getSessions: getSessions,
    editSession: editSession,
    deleteSession: deleteSession
};
const pool = require('../db/pool');

async function createUser(req, res) {
    const userInfo = req.body;

    const queryText = 'INSERT INTO users (name, username, password, grade) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [userInfo.name, userInfo.username, userInfo.password, userInfo.grade];

    try {
        const result = await pool.query(queryText, values);
        console.log('User created successfully: ', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating user: ', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = createUser;
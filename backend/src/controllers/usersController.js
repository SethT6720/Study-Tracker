const pool = require('../db/pool');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
    const userInfo = req.body;
    const hash = await bcrypt.hash(userInfo.password, 10);

    const queryText = 'INSERT INTO users (name, username, password, grade) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [userInfo.name, userInfo.username, hash, userInfo.grade];

    try {
        const result = await pool.query(queryText, values);
        console.log('User created successfully: ', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).send('Username already taken');
            return;
        }

        console.error('Error creating user: ', err.message);
        res.status(500).json({ error: err.message });
    }
}

async function getUser(req, res) {
    const id = req.params.id;

    const queryText = 'SELECT * FROM users WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send('User not found');
            return;
        }
        console.log(`Fetched user with id ${id}: `, result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user: ', err.message);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createUser: createUser,
    getUser: getUser
};
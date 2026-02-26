const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    const { username, password } = req.body;
    let result;

    try {
        const queryText = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send(`User with username ${username} not found`);
            return;
        }
    } catch (err) {
        next(err);
    }

    const correctPassword = await bcrypt.compare(password, result.rows[0].password);
    if (!correctPassword) {
        res.status(401).send('Password incorrect');
        return;
    }
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWTSECRETKEY, { expiresIn: '24h' });
    res.status(200).json(token);
}

module.exports = {
    login: login
};
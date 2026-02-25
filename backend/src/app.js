require('dotenv').config();
const express = require('express');
const pool = require('./db/pool');

const usersRouter = require('./routes/users');
const subjectsRouter = require('./routes/subjects');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', usersRouter);

app.use('/subjects', subjectsRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up and running");
});

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    }
}
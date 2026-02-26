require('dotenv').config();
const express = require('express');
const pool = require('./db/pool');

const usersRouter = require('./routes/users');
const subjectsRouter = require('./routes/subjects');
const sessionsRouter = require('./routes/sessions');
const statsRouter = require('./routes/stats');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);
app.use('/sessions', sessionsRouter);
app.use('/stats', statsRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up and running");
});
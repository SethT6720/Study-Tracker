require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const subjectsRouter = require('./routes/subjects');
const sessionsRouter = require('./routes/sessions');
const statsRouter = require('./routes/stats');
const authRouter = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);
app.use('/sessions', sessionsRouter);
app.use('/stats', statsRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up and running");
});
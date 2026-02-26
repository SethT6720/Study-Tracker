const pool = require('../db/pool');

async function getWeeklyStats(req, res, next) {
    const userId = req.user.id;

    const queryText = "SELECT SUM(duration) FROM study_sessions WHERE (start_time >= NOW() - INTERVAL '7 days') AND user_id = $1";
    const values = [userId];

    try {
        const result = await pool.query(queryText, values);
        
        if (result.rows[0].sum === null) {
            res.status(404).send('No sessions found for user within past 7 days');
            return;
        }

        console.log(`Logged ${result.rows[0].sum} seconds of study time within past 7 days`);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function getMonthlyStats(req, res, next) {
    const userId = req.user.id;

    const queryText = "SELECT SUM(duration) FROM study_sessions WHERE (start_time >= NOW() - INTERVAL '30 days') AND user_id = $1";
    const values = [userId];

    try {
        const result = await pool.query(queryText, values);
        
        if (result.rows[0].sum === null) {
            res.status(404).send('No sessions found for user within past 30 days');
            return;
        }

        console.log(`Logged ${result.rows[0].sum} seconds of study time within past 30 days`);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function getSubjectBreakdown(req, res, next) {
    const userId = req.user.id;

    const queryText = 'SELECT subject_id, SUM(duration) FROM study_sessions WHERE user_id = $1 GROUP BY subject_id'
    const values = [userId];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === null) {
            res.status(404).send("No sessions found for user");
            return;
        }

        console.log(`Subject Breakdown retrieved for user with id ${userId}: `, result.rows);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

async function getMostStudiedSubject(req, res, next) {
    const userId = req.user.id;

    const queryText = 'SELECT subject_id, SUM(duration) FROM study_sessions WHERE user_id = $1 GROUP BY subject_id ORDER BY SUM(duration) DESC LIMIT 1';
    const values = [userId];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send("No sesions found for user");
            return;
        }

        console.log(`Most studied subject fetched for user with id ${userId}: `, result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}

async function getStudyStreak(req, res, next) {
    const userId = req.user.id;

    const queryText = "SELECT DISTINCT DATE_TRUNC('day', start_time) AS day FROM study_sessions WHERE user_id = $1 ORDER BY day DESC";
    const values = [userId];

    try {
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            res.status(404).send('No sessions found for user');
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;

        result.rows.forEach((row) => {
            row.day.setHours(0, 0, 0, 0);
        });
        
        const studied_today = today.getTime() === result.rows[0].day.getTime();
        const studied_yesterday = (today.getTime() - 86400000) === result.rows[0].day.getTime();
        const output = {
            streak: 0,
            studied_today: studied_today
        };
        if (studied_today || studied_yesterday) {
            output.streak++;
            if (result.rowCount <= 1) {
                console.log(`Streak for user with id ${userId}: `, output);
                res.status(200).json(output);
                return;
            }

            for (let i = 1; i < result.rowCount; i++) {
                const time = result.rows[i].day.getTime();
                const compareTo = result.rows[i - 1].day.getTime() - 86400000;
                if (time === compareTo) {
                    output.streak++;
                } else {
                    break;
                }
            }
        }
        console.log(`Streak for user with id ${userId}: `, output);
        res.status(200).json(output);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getWeeklyStats: getWeeklyStats,
    getMonthlyStats: getMonthlyStats,
    getSubjectBreakdown: getSubjectBreakdown,
    getMostStudiedSubject: getMostStudiedSubject,
    getStudyStreak: getStudyStreak
};
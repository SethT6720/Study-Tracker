const pool = require('../db/pool');

async function getWeeklyStats(req, res) {
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
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}
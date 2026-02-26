const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;
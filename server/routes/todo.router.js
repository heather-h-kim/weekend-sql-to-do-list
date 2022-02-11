const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
});

pool.on('connect', () => {
    console.log('Postgresql is connected');
});

pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
});

router.get('/', (req, res) => {
    let queryText = `
    SELECT * FROM "tasks"
    `
    pool.query(queryText)
    .then((result) => {
        console.log(result);
        res.send(result.rows);
    }).catch((err) => {
        console.log('Error making query', queryText, err);
        res.sendStatus(500);
    });
});

module.exports = router;
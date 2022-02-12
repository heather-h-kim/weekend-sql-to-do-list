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

//get data from the database and send it back to the client
router.get('/', (req, res) => {
    let queryText = `
    SELECT * FROM "tasks"
    `
    pool.query(queryText)
    .then((result) => {
        res.send(result.rows);
    }).catch((err) => {
        console.log('Error making query', queryText, err);
        res.sendStatus(500);
    });
});

//save new data to the database
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log(req.body);

    let queryText = `
    INSERT INTO "tasks" ("task", "deadline", "is_completed")
    VALUES ($1, $2, $3);
    `;

    let valueArray = [newTask.task, newTask.deadline, newTask.is_completed];

    pool.query(queryText, valueArray)
    .then( result => {
        res.sendStatus(201);
    }).catch( error => {
        console.log('Error adding task', error);
        res.sendStatus(500);
    });
});

module.exports = router;
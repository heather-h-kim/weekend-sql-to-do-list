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
    INSERT INTO "tasks" ("task", "deadline")
    VALUES ($1, $2);
    `;

    let valueArray = [newTask.task, newTask.deadline];

    pool.query(queryText, valueArray)
    .then( result => {
        res.sendStatus(201);
    }).catch( error => {
        console.log('Error adding task', error);
        res.sendStatus(500);
    });
});

//update is_complete
router.put('/:id', (req, res) => {
    let idToUpdate = req.params.id;
    console.log(idToUpdate);
    
    const queryText = `
    UPDATE "tasks"
    SET "is_completed" = true
    WHERE "id" = $1;
    `;
    pool.query(queryText, [idToUpdate])
    .then(result => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    });
});

//delete the selected task
router.delete('/:id', (req, res) => {
    let idToDelete = req.params.id;
    const queryText = `
    DELETE FROM "tasks"
    WHERE "id" = $1;
    `;
    pool.query(queryText, [idToDelete])
    .then((result) => {
        console.log('Task deleted');
        res.sendStatus(200);   
    }).catch((error) => {
        console.log('Error deleting the task', error);
        res.sendStatus(500);
    });
});

module.exports = router;
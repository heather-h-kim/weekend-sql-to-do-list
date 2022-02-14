const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const pg = require('pg');
const Pool = pg.Pool;

let config = {};
// We need a different pg configuration if we're running
// on Heroku, vs if we're running locally.
//
// Heroku gives us a process.env.DATABASE_URL variable,
// so if that's set, we know we're on heroku.
if (process.env.DATABASE_URL) {
  config = {
    // We use the DATABASE_URL from Heroku to connect to our DB
    connectionString: process.env.DATABASE_URL,
    // Heroku also requires this special `ssl` config
    ssl: { rejectUnauthorized: false },
  };
} else {
  // If we're not on heroku, configure PG to use our local database
  config = {
    host: 'localhost',
    port: 5432,
    database: process.send.DATABASE_NAME || 'weekend-to-do-app', // CHANGE THIS LINE to match your local database name!
  };
}


const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Postgresql is connected');
});

pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
});

//get data from the database and send it back to the client
router.get('/', (req, res) => {
    let queryText = `
    SELECT *, TO_CHAR("deadline", 'mm-dd-yyyy') AS "new_deadline", 
    TO_CHAR("completed_date", 'mm-dd-yyyy') AS "new_completed_date" FROM "tasks" ORDER BY "deadline";
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
    let valueArrays= [req.body.newStatus, req.params.id];
    console.log(req.body.newStatus);
    
    const queryText = `
    UPDATE "tasks"
    SET "is_completed" = $1
    WHERE "id" = $2;
    `;
    pool.query(queryText, valueArrays)
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
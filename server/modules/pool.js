const pg = require('pg');
const Pool = pg.Pool;
const config= {
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 3000
}
// const url = require('url');
// let config = {};
// // We need a different pg configuration if we're running
// // on Heroku, vs if we're running locally.
// //
// // Heroku gives us a process.env.DATABASE_URL variable,
// // so if that's set, we know we're on heroku.
// if (process.env.DATABASE_URL) {
//   config = {
//     // We use the DATABASE_URL from Heroku to connect to our DB
//     connectionString: process.env.DATABASE_URL,
//     // Heroku also requires this special `ssl` config
//     ssl: { rejectUnauthorized: false },
//   };
// } else {
//   // If we're not on heroku, configure PG to use our local database
//   config = {
//     host: 'localhost',
//     port: 5432,
//     database: process.env.DATABASE_NAME || 'weekend-to-do-app' // CHANGE THIS LINE to match your local database name!
//   };
// }

// const pool = new pg.Pool(config);

// pool.on('connect', () => {
//     console.log('Postgresql is connected');
// });

// pool.on('error', (error) => {
//     console.log('Error with postgres pool', error);
//     process.exit(-1);
// });

const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Postgresql is connected');
});

pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
});

module.exports = pool;
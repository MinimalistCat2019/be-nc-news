const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');

const dbConfig =
  ENV === 'production'
    ? { client: 'pg', connection: process.env.DATABASE_URL }
    : require('../knexfile');

module.exports = knex(dbConfig);






// The following three lines are what I set up when I was creating the backend originally. This has now been overwritten with the above code, when hosting the database on Heroku. 
// const knex = require('knex');
// const config = require('../knexfile');

// const connection = knex(config);

// module.exports = connection;
const { Pool } = require('pg');

const pool1 = new Pool({
  connectionString: process.env.DATABASE_URL_1,
  ssl: {
    rejectUnauthorized: false
  }
});

const pool2 = new Pool({
  connectionString: process.env.DATABASE_URL_2,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = { pool1, pool2 };

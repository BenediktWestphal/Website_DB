import pkg from 'pg';
const { Pool } = pkg;

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

export { pool1, pool2 };

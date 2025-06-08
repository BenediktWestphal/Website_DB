const express = require("express");
const cors = require("cors");
const { pool1, pool2 } = require("./db"); // Assuming db.js exports pool1 and pool2

const DB1_TABLE_IDENTIFIERS = ['t1', 't2', 't3'];
const DB1_TABLE_NAMES = {
  't1': 'entries_db1_t1',
  't2': 'entries_db1_t2',
  't3': 'entries_db1_t3'
};
const DB2_TABLE_NAME = 'entries_db2_default';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

app.get("/api", async (req, res) => {
  let db1Connected = false;
  let db2Connected = false;
  let db1Error = null;
  let db2Error = null;
  let time1 = null;
  let time2 = null;

  try {
    const result1 = await pool1.query("SELECT NOW()");
    time1 = result1.rows[0].now;
    db1Connected = true;
  } catch (err) {
    console.error("DB1 connection error:", err.message);
    db1Error = err.message;
  }

  try {
    const result2 = await pool2.query("SELECT NOW()");
    time2 = result2.rows[0].now;
    db2Connected = true;
  } catch (err) {
    console.error("DB2 connection error:", err.message);
    db2Error = err.message;
  }

  let message = "";
  if (db1Connected && db2Connected) {
    message = "Database 1 and Database 2 connected!";
    res.json({ message, time1, time2 });
  } else if (db1Connected) {
    message = "Database 1 connected, Database 2 connection failed.";
    res.status(500).json({ message, time1, db2Error });
  } else if (db2Connected) {
    message = "Database 2 connected, Database 1 connection failed.";
    res.status(500).json({ message, time2, db1Error });
  } else {
    message = "Failed to connect to both Database 1 and Database 2.";
    res.status(500).json({ message, db1Error, db2Error });
  }
});

// Create a new entry
app.post("/api/entries", async (req, res) => {
  const { content, dbIdentifier, tableIdentifier } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  let selectedPool;
  let tableName;

  if (dbIdentifier === 'db1') {
    if (!DB1_TABLE_IDENTIFIERS.includes(tableIdentifier)) {
      return res.status(400).json({ error: "Invalid tableIdentifier for Database 1. Must be one of: " + DB1_TABLE_IDENTIFIERS.join(', ') });
    }
    selectedPool = pool1;
    tableName = DB1_TABLE_NAMES[tableIdentifier];
  } else if (dbIdentifier === 'db2') {
    selectedPool = pool2;
    tableName = DB2_TABLE_NAME;
    // Optional: Handle if tableIdentifier is provided for db2, e.g., ignore or error
    // if (tableIdentifier) {
    //   console.warn(`tableIdentifier ('${tableIdentifier}') provided for db2, but it's not used.`);
    // }
  } else {
    return res.status(400).json({ error: "Invalid dbIdentifier. Must be 'db1' or 'db2'." });
  }

  try {
    const query = `INSERT INTO ${tableName} (content) VALUES ($1) RETURNING *`;
    const result = await selectedPool.query(query, [content]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`Error inserting entry into ${dbIdentifier} (table: ${tableName}):`, err.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// Get all entries
app.get("/api/entries", async (req, res) => {
  const allEntries = [];
  try {
    // Fetch from Database 1
    for (const tableId of DB1_TABLE_IDENTIFIERS) {
      const currentTableName = DB1_TABLE_NAMES[tableId];
      const result = await pool1.query(`SELECT * FROM ${currentTableName} ORDER BY id`);
      const mappedResults = result.rows.map(entry => ({ ...entry, source_db: 'db1', source_table: tableId }));
      allEntries.push(...mappedResults);
    }

    // Fetch from Database 2
    const resultDb2 = await pool2.query(`SELECT * FROM ${DB2_TABLE_NAME} ORDER BY id`);
    const entriesDb2 = resultDb2.rows.map(entry => ({ ...entry, source_db: 'db2', source_table: 'default' }));
    allEntries.push(...entriesDb2);

    res.status(200).json(allEntries);
  } catch (err) {
    console.error("Error fetching entries:", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

async function createEntriesTable(pool, dbName) {
  const client = await pool.connect();
  try {
    if (dbName === 'Database 1') {
      for (const tableName of Object.values(DB1_TABLE_NAMES)) {
        await client.query(`
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            content TEXT
          );
        `);
        console.log(`Table "${tableName}" in Database 1 created or already exists.`);
      }
    } else if (dbName === 'Database 2') {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${DB2_TABLE_NAME} (
          id SERIAL PRIMARY KEY,
          content TEXT
        );
      `);
      console.log(`Table "${DB2_TABLE_NAME}" in Database 2 created or already exists.`);
    }
  } catch (err) {
    console.error(`Error creating table(s) in ${dbName}:`, err.message);
  } finally {
    client.release();
  }
}

async function startServer() {
  await createEntriesTable(pool1, 'Database 1');
  await createEntriesTable(pool2, 'Database 2');
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

startServer();

const express = require("express");
const cors = require("cors");
const { pool1, pool2 } = require("./db"); // Assuming db.js exports pool1 and pool2

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
  const { content, dbIdentifier } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  if (dbIdentifier !== 'db1' && dbIdentifier !== 'db2') {
    return res.status(400).json({ error: "Invalid dbIdentifier. Must be 'db1' or 'db2'." });
  }

  const selectedPool = dbIdentifier === 'db1' ? pool1 : pool2;

  try {
    const result = await selectedPool.query(
      "INSERT INTO entries (content) VALUES ($1) RETURNING *",
      [content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(`Error inserting entry into ${dbIdentifier}:`, err.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// Get all entries
app.get("/api/entries", async (req, res) => {
  try {
    const result1 = await pool1.query("SELECT * FROM entries ORDER BY id");
    const entries1 = result1.rows.map(entry => ({ ...entry, source_db: 'db1' }));

    const result2 = await pool2.query("SELECT * FROM entries ORDER BY id");
    const entries2 = result2.rows.map(entry => ({ ...entry, source_db: 'db2' }));

    const combinedEntries = [...entries1, ...entries2];
    res.status(200).json(combinedEntries);
  } catch (err) {
    console.error("Error fetching entries:", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

async function createEntriesTable(pool, dbName) {
  const client = await pool.connect();
  try {
    console.log(`Checking/creating "entries" table for ${dbName}...`);
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id SERIAL PRIMARY KEY,
        content TEXT
      );
    `);
    if (result.command === 'CREATE') {
      console.log(`Table "entries" created successfully in ${dbName}.`);
    } else {
      console.log(`Table "entries" already exists in ${dbName}.`);
    }
  } catch (err) {
    console.error(`Error creating table "entries" in ${dbName}:`, err.message);
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

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Datenbank verbunden!", time: result.rows[0].now });
  } catch (err) {
    console.error("DB-Fehler:", err.message);
    res.status(500).json({ error: "Fehler bei Datenbankzugriff" });
  }
});

// Create a new entry
app.post("/api/entries", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO entries (content) VALUES ($1) RETURNING *",
      [content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting entry:", err.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// Get all entries
app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries ORDER BY id");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching entries:", err.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

async function createEntriesTable() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS entries (
        id SERIAL PRIMARY KEY,
        content TEXT
      );
    `);
    if (result.command === 'CREATE') {
      console.log('Table "entries" created successfully.');
    } else {
      console.log('Table "entries" already exists.');
    }
  } catch (err) {
    console.error('Error creating table "entries":', err.message);
  } finally {
    client.release();
  }
}

async function startServer() {
  await createEntriesTable();
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

startServer();

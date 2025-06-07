const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Verbindung zur Datenbank
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test 1: Standard-Route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Test 2: Datenbank-Check
app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "DB verbunden!", serverTime: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Datenbankverbindung fehlgeschlagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

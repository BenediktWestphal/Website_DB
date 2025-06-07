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

app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Datenbank verbunden!", time: result.rows[0].now });
  } catch (err) {
    console.error("DB-Fehler:", err.message);
    res.status(500).json({ error: "Fehler bei Datenbankzugriff" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

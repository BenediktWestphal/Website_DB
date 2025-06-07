import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Test-Route: Daten auslesen
app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Datenbank verbunden!", serverTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB-Verbindung fehlgeschlagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf Port ${PORT}`);
});

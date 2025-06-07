# ✨ Fullstack Web App

Dies ist eine einfache Fullstack-Webanwendung.

---

## 🚀 Funktionen

- Benutzer können Texteingaben senden und diese speichern.
- Alle gespeicherten Einträge werden in einer Liste angezeigt.
- Daten werden über eine REST-API an ein PostgreSQL-Backend gesendet.
- Tabelle `entries` wird automatisch beim Start erstellt.

---

## ⚙️ Setup and Configuration

This application requires a backend setup with connection to two PostgreSQL databases.

### Environment Variables

The backend requires the following environment variables to be set. You can use the `backend/.env.example` file as a template by creating a `.env` file in the `backend` directory.

- `DATABASE_URL_1`: The connection string for the first PostgreSQL database.
  - Example: `postgresql://user:password@host:port/database_name_1`
- `DATABASE_URL_2`: The connection string for the second PostgreSQL database.
  - Example: `postgresql://user:password@host:port/database_name_2`
- `PORT`: (Optional) The port on which the backend server will run. Defaults to 3000.

The `backend/.env.example` file has been updated to reflect these requirements.

---

## 📡 API Endpoints

The backend provides the following REST API endpoints:

### `GET /api`

- **Purpose:** Health check and database connection status.
- **Response:**
  - `200 OK`: JSON object with a message indicating the connection status of both databases (e.g., `"Database 1 and Database 2 connected!"`) and their current times.
  - `500 Internal Server Error`: If one or both database connections fail, the message will indicate the specific failure.

### `POST /api/entries`

- **Purpose:** Creates a new entry in one of the databases.
- **Request Body:** `application/json`
  - `content` (string, required): The text content for the new entry.
  - `dbIdentifier` (string, required): Specifies the target database.
    - `'db1'`: Use Database 1.
    - `'db2'`: Use Database 2.
  - `tableIdentifier` (string, optional): Specifies the target table within Database 1.
    - **Required if `dbIdentifier` is `'db1'`**. Valid values are: `'t1'`, `'t2'`, `'t3'`.
    - This parameter is ignored if `dbIdentifier` is `'db2'`.
- **Responses:**
  - `201 Created`: JSON object representing the newly created entry, including its `id`, `content`, `source_db`, and `source_table`.
  - `400 Bad Request`: If `content` is missing, `dbIdentifier` is invalid, or `tableIdentifier` is missing/invalid for Database 1. The response body will contain an `error` message.
  - `500 Internal Server Error`: If there's a problem inserting the entry into the database.

### `GET /api/entries`

- **Purpose:** Retrieves all entries from all configured tables in both databases.
- **Response:**
  - `200 OK`: JSON array of entry objects. Each entry object includes:
    - `id` (integer): The unique ID of the entry within its specific table and database.
    - `content` (string): The content of the entry.
    - `source_db` (string): Indicates the source database ('db1' or 'db2').
    - `source_table` (string): Indicates the source table identifier.
      - For 'db1': `'t1'`, `'t2'`, or `'t3'`.
      - For 'db2': `'default'` (referring to the table `entries_db2_default`).
  - `500 Internal Server Error`: If there's an error fetching entries from the databases.

---

## 🧰 Technologien

Dieses Projekt verwendet:

### 🖥️ Frontend
- [React](https://reactjs.org/) – UI-Framework
- [Vite](https://vitejs.dev/) – Build-Tool für schnelle Entwicklung

### 🔧 Backend
- [Node.js](https://nodejs.org/) – JavaScript-Laufzeit
- [Express.js](https://expressjs.com/) – Webserver-Framework

### 🗄️ Datenbank
- [PostgreSQL](https://www.postgresql.org/) – relationale Datenbank
- [pg (node-postgres)](https://node-postgres.com/) – PostgreSQL-Client für Node.js

### ☁️ Hosting / Infrastruktur
- [Railway](https://railway.app/) – Hosting-Plattform für Backend, Frontend & Datenbank
- GitHub – Codeverwaltung & Continuous Deployment

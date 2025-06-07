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

# Simple Fullstack Application (HTML/JS Frontend + Python/Flask Backend)

This is a basic example of a fullstack application with a static frontend (HTML, CSS, JavaScript) and a Python Flask backend. The frontend is designed for deployment on Vercel, and the backend for Render.

## Project Structure

```
.
├── index.html        # Frontend: Main HTML page
├── script.js         # Frontend: JavaScript for interaction
├── style.css         # Frontend: CSS for styling
├── main.py           # Backend: Flask application
├── requirements.txt  # Backend: Python dependencies
├── vercel.json       # Vercel deployment configuration
├── render.yaml       # Render deployment configuration
└── README.md         # This file
```

## Running Locally

### Backend (Python/Flask)

1.  **Navigate to the project directory.**
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Flask application:**
    ```bash
    python main.py
    ```
    The backend will typically start on `http://127.0.0.1:8080/api/data`. Check the console output for the exact URL.

### Frontend (HTML/JS)

1.  **Open `index.html` directly in your web browser.**
    *   You can usually do this by double-clicking the file or using your browser's "Open File" option.
2.  **Update Backend URL in `script.js`:**
    *   Before the frontend can fetch data from your *local* backend, you need to update the `backendUrl` variable in `script.js`.
    *   Change `const backendUrl = 'https://your-render-backend-url.onrender.com/api/data';`
    *   To (for example): `const backendUrl = 'http://127.0.0.1:8080/api/data';` (or whatever port your local backend is running on).
3.  **Test:**
    *   Click the "Fetch Data from Backend" button. You should see a message from your local backend.

## Deployment

### Backend to Render

1.  **Create a new Web Service on Render.**
2.  **Connect your Git repository.**
3.  **Configure the service:**
    *   **Environment:** Python
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `python main.py`
    *   Render will automatically detect `render.yaml` if it's in the root of your repository and can pre-fill some of these settings. You might need to confirm or adjust them.
    *   Ensure the **Plan** (e.g., Free) is selected.
4.  **Deploy.**
5.  **Once deployed, Render will provide you with a URL for your backend service (e.g., `https://your-service-name.onrender.com`).** Note this URL.

### Frontend to Vercel

1.  **Create a new Project on Vercel.**
2.  **Connect your Git repository.**
3.  **Configure the project:**
    *   Vercel should automatically detect that it's a static site. The `vercel.json` file provides build and routing configurations.
    *   No special framework preset is typically needed for plain HTML/CSS/JS.
4.  **Update Backend URL in `script.js` (IMPORTANT):**
    *   Before deploying (or by making a new commit after the first deployment), you **MUST** update the `backendUrl` variable in `script.js` to point to your live Render backend URL.
    *   Change `const backendUrl = 'http://127.0.0.1:8080/api/data';` (or the placeholder)
    *   To: `const backendUrl = 'https://your-render-backend-url.onrender.com/api/data';` (replace with your actual Render service URL).
5.  **Deploy.**
6.  Vercel will provide you with a URL for your frontend (e.g., `https://your-project-name.vercel.app` or your custom domain `benediktwestphal.com` if you configure it).

### Pointing `benediktwestphal.com` to Vercel

1.  After deploying your frontend to Vercel, go to your Vercel project settings.
2.  Navigate to the "Domains" section.
3.  Add `benediktwestphal.com` (and optionally `www.benediktwestphal.com`) as a custom domain.
4.  Vercel will provide you with DNS records (usually A records or CNAME records) that you need to configure in your domain registrar's DNS settings (wherever you bought `benediktwestphal.com`).
5.  Update your DNS records with your domain registrar. DNS propagation can take some time.

## How it Works

*   The **frontend** (`index.html`, `script.js`, `style.css`) runs in the user's browser.
*   When the "Fetch Data" button is clicked, `script.js` makes an HTTP GET request to the specified `backendUrl`.
*   The **backend** (`main.py`) is a Flask server listening for requests.
*   The `/api/data` endpoint on the backend receives the request, processes it (in this case, just generates a simple message and timestamp), and returns a JSON response.
*   The frontend's JavaScript receives this JSON response and updates the content of the `dataContainer` div to display the message.
*   `CORS(app)` in `main.py` is important to allow the frontend (served from a different domain like Vercel) to make requests to the backend (served from Render).
*   `vercel.json` tells Vercel how to serve your static files.
*   `render.yaml` tells Render how to build and run your Python application.

This provides a complete, albeit simple, fullstack flow.

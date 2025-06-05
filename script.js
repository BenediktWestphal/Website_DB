document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchButton');
    const dataContainer = document.getElementById('dataContainer');

    // IMPORTANT: Replace this URL with your actual Render backend URL after deployment
    const backendUrl = 'https://hello-world-website-nnmy.onrender.com/api/data';

    fetchButton.addEventListener('click', async () => {
        dataContainer.textContent = 'Loading...';
        try {
            const response = await fetch(backendUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dataContainer.textContent = `Message from backend: ${data.message} - Timestamp: ${data.timestamp}`;
        } catch (error) {
            console.error('Error fetching data:', error);
            dataContainer.textContent = `Error fetching data: ${error.message}. Make sure the backend is running and the URL in script.js is correct.`;
        }
    });
});

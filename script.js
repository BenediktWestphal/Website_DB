console.log('script.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    const fetchButton = document.getElementById('fetchButton');
    console.log('fetchButton element:', fetchButton);
    const dataContainer = document.getElementById('dataContainer');

    // IMPORTANT: Replace this URL with your actual Render backend URL after deployment
    const backendUrl = 'https://hello-world-website-nnmy.onrender.com/api/data';

    console.log('Attaching click listener to fetchButton');
    fetchButton.addEventListener('click', async () => {
        dataContainer.textContent = 'Loading...';
        try {
            console.log('Attempting to fetch from URL:', backendUrl);
            const response = await fetch(backendUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dataContainer.textContent = `Message from backend: ${data.message} - Timestamp: ${data.timestamp}`;
        } catch (error) {
            console.error('Error fetching data:', error);
            console.error('Full error object:', error);
            if (error.response) {
                console.error('Error response object:', error.response);
            }
            dataContainer.textContent = `Error fetching data: ${error.message}. Make sure the backend is running and the URL in script.js is correct.`;
        }
    });
});

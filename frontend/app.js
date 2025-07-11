const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', { message: null });
});

app.post('/submit', async (req, res) => {
    const { name, email } = req.body;
    console.log('Received form submission on frontend:', { name, email, message });

    const BACKEND_HOST = process.env.BACKEND_HOST || 'backend';
    const backendUrl = `http://${BACKEND_HOST}:5000/process`;
    console.log(`Attempting to send data to backend at: ${backendUrl}`);

    try {
        const response = await axios.post(backendUrl, {
            name,
            email
        });

        console.log('Backend response:', response.data);
        res.render('index', {
            message: 'Form submitted successfully to backend! Check backend logs for details.'
        });
    } catch (error) {
        console.error('Error sending data to backend:', error.message);
        if (error.response) {
            console.error('Backend error response data:', error.response.data);
            res.render('index', {
                message: `Error: Could not connect to backend or backend returned an error. Status: ${error.response.status}`
            });
        } else if (error.request) {
            console.error('No response received from backend. Request details:', error.request);
            res.render('index', {
                message: 'Error: No response received from backend. Is the backend running and accessible?'
            });
        } else {
            console.error('Error setting up request:', error.message);
            res.render('index', {
                message: `Error: ${error.message}`
            });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server listening on port ${PORT}`);
    console.log(`Access the frontend at http://localhost:${PORT}`);
});

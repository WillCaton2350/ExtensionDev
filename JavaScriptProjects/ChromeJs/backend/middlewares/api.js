const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/opencv.js', (req, res) => {
    res.type('text/javascript');
    res.sendFile(path.join(__dirname, 'opencv.js'));
});

app.get('/HandTrackingModule.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'HandTrackingModule.js'));
});

app.get('/middlewares/api.js', (req, res) => {
    res.type('text/javascript');
    res.sendFile(path.join(__dirname, 'api.js'));
});

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'frontend', 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading HTML file: ${err.message}`);
            res.status(500).json({ error: `Internal Server Error: ${err.message}` });
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/changeVolume', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const requestData = JSON.parse(body);
        const { volume } = requestData;
        const script = `osascript -e 'set volume output volume ${volume}'`;
        exec(script, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error changing volume: ${stderr}`);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(`Volume changed on the server: ${volume}`);
                res.status(200).json({ message: 'Volume changed successfully' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
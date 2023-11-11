const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/frontend'));

app.get('/', (req, res) => {

    fs.readFile(__dirname + '/frontend/index.html', 'utf8', (err, data) => {
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
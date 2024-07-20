const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/play', (req, res) => {
    const filePath = path.join(__dirname + '/../songs/03 - Time Is Running Out.mp3');

    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error(err);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found');
            return;
        }

        const range = req.headers.range;

        if (range) {
            const fileSize = stats.size;
            const chunkSize = 1024 * 1024;
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + chunkSize, fileSize - 1);

            res.writeHead(206, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': end - start,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
            });

            const stream = fs.createReadStream(filePath, { start, end });
            
            stream.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': stats.size,
            });

            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
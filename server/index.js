const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const mm = require('music-metadata');


const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/play', (req, res) => {
    const fileList = fs.readdirSync(path.join(__dirname + '/../songs'));
    const songList = fileList.filter(file => file.endsWith('.mp3'));
    const randi = Math.floor(Math.random() * songList.length);

    const filePath = path.join(__dirname + '/../songs/'+songList[randi]);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error(err);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found');
            return;
        }
        mm.parseFile(filePath).then(metadata => {
            //console.log(metadata.format);
            const bitrate = metadata.format.bitrate;
            const length = metadata.format.duration;

            const bytesPerSecond = bitrate / 8;
            const fileSize = stats.size;
            const duration = 10;
            const startSec = Math.floor(Math.random() * (length - duration));
            console.log('startSec', startSec);
            const startByte = startSec * bytesPerSecond;
            const endByte = startByte + duration * bytesPerSecond;
            if (endByte > fileSize) {
                endByte = fileSize;
            }
            
            /*const range = req.headers.range;
            if (range) {
                const chunkSize = 1024 * 1024;
                const startRange = Number(range.replace(/\D/g, ""));
                const start = startByte + startRange;
                const end = Math.min(start + chunkSize, endByte);
                console.log('start', start);
                console.log('end', end);
    
                res.writeHead(206, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': end - start,
                    'Content-Range': `bytes ${start}-${end}/${duration * bytesPerSecond}`,
                    'Accept-Ranges': 'bytes',
                });
    
                const stream = fs.createReadStream(filePath, { start, end });
                
                stream.pipe(res);
            
            } else {*/
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': duration * bytesPerSecond,
                    'Content-Range': `bytes ${startByte}-${endByte}/${duration * bytesPerSecond}`,
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'no-store'
                });
    
                const stream = fs.createReadStream(filePath, { start: startByte, end: endByte });
                stream.pipe(res);
            //}
        });
        
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
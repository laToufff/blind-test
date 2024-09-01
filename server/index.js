const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mm = require('music-metadata');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

let currentSong = null;

function getSongList() {
    const fileList = fs.readdirSync(path.join(__dirname + '/../songs'));
    const songList = fileList.filter(file => file.endsWith('.mp3'));
    return songList;
}

async function getSongNames(callback) {
    let songNames = [];
    const songList = getSongList();
    for (const song of songList) {
        const filePath = path.join(__dirname + '/../songs/'+song);
        const metadata = await mm.parseFile(filePath)
        const name = metadata.common.title;
        songNames.push(name);
    };
    callback(songNames);
}

app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/play', (req, res) => {
    const songList = getSongList();
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
            const name = metadata.common.title;
            currentSong = name;

            const bytesPerSecond = bitrate / 8;
            const fileSize = stats.size;
            const duration = 10;
            const startSec = Math.floor(Math.random() * (length - duration));
            const startByte = startSec * bytesPerSecond;
            const endByte = startByte + duration * bytesPerSecond;
            if (endByte > fileSize) {
                endByte = fileSize;
            }
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': duration * bytesPerSecond,
                'Content-Range': `bytes ${startByte}-${endByte}/${duration * bytesPerSecond}`,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'no-cache'
            });

            const stream = fs.createReadStream(filePath, { start: startByte, end: endByte });
            stream.pipe(res);
        });
        
    });
});

app.get('/songs', (req, res) => {
    getSongNames(songNames => {
        res.send(songNames);
    });
});

app.get('/currentsong', (req, res) => {
    res.send(currentSong);
});

app.post('/submit', (req, res) => {
    const songname = req.body.songname;
    if (songname.toLowerCase() === currentSong.toLowerCase()) {
        res.send(true);
    } else {
        res.send(false);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
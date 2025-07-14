const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const mm = require('music-metadata');
const bodyParser = require('body-parser');

const stream = require('./modules/streaming');
const { getSongList, getSongNames } = require('./modules/songs');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

let currentSong = {};

app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/play', async (req, res) =>{
    const songList = getSongList();
    const randi = Math.floor(Math.random() * songList.length);

    const filePath = path.join(__dirname + '/../songs/'+songList[randi]);
    const metadata = await mm.parseFile(filePath);

    const name = await stream(filePath, metadata, res);
    currentSong[req.session.id] = name;
});

app.get('/songs', (req, res) => {
    getSongNames(songNames => {
        res.send(songNames);
    });
});

app.get('/currentsong', (req, res) => {
    const song = currentSong[req.session.id];
    delete currentSong[req.session.id];
    res.send(song);

});

app.post('/submit', (req, res) => {
    const songname = req.body.songname;
    if (songname.toLowerCase() === currentSong[req.session.id].toLowerCase()) {
        res.send(true);
    } else {
        res.send(false);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
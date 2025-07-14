const express = require('express');
const { createServer } = require('http');
//const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const mm = require('music-metadata');
const bodyParser = require('body-parser');
const { Server } = require("socket.io")

const stream = require('./modules/streaming');
const { getRandomSong, getSongNames } = require('./modules/songs');
const { addPlayer, removePlayer, resetPlayers, setFinishTime, getPlayerList } = require('./modules/players');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server)

app.use(bodyParser.json());
/*app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));*/

let currentSong = {};

app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

io.on('connection', async (socket) => {
    const songList = await getSongNames();
    socket.emit('songlist', songList);

    socket.on('submit', async (value, callback) => {
        const isCorrect = value.toLowerCase() === currentSong.name.toLowerCase();
        if (isCorrect) {
            const finishTime = Date.now() - currentSong.time;
            setFinishTime(socket.id, finishTime);
            console.log(`${socket.id} guessed correctly: ${value} in ${finishTime} ms`);
            io.emit('playerfinish', { id: socket.id, time: finishTime });
        }
        callback(isCorrect);
    });

    socket.on('start', async () => {
        currentSong = await getRandomSong();
        io.emit('play');
        console.log('New song started:', currentSong.name);
    });

    socket.on('join', (username) => {
        addPlayer(socket.id, username);
        io.emit('playerlist', getPlayerList());
    });

    socket.on('disconnect', () => {
        removePlayer(socket.id);
        io.emit('playerlist', getPlayerList());
    });
});

app.get('/play', async (req, res) =>{
    await stream(currentSong, res);
});

app.get('/currentsong', (req, res) => {
    res.send(currentSong.name);

});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
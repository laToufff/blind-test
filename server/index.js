const express = require('express');
const { createServer } = require('http');
const { parse } = require('cookie')
const dotenv = require('dotenv');
const path = require('path');
const mm = require('music-metadata');
const bodyParser = require('body-parser');
const { Server } = require("socket.io")

const stream = require('./modules/streaming');
const { getRandomSong, getSongNames } = require('./modules/songs');
const pl = require('./modules/players');

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

io.use((socket, next) => {
  var cookie = socket.request.headers.cookie;
  if (cookie) {
    cookie = parse(cookie)
    const session_id = cookie.session_id;
    if (session_id) {
      socket.session_id = session_id;
      next();
    }
  }
  if(!socket.session_id) {
    socket.session_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    next();
  }
});

io.on('connection', async (socket) => {
    socket.emit("session_id", socket.session_id);

    socket.on('join', async () => {
        if (!pl.getPlayerById(socket.session_id)) {
            socket.emit("redirect", "/login");
            return;
        } else {
            const songList = await getSongNames();
            socket.emit('songlist', songList);
            pl.setPlayerOnline(socket.session_id, true);
            io.emit('playerlist', pl.getPlayerList());
        }
    });

    socket.on('submit', async (value, callback) => {
        const isCorrect = value.toLowerCase() === currentSong.name.toLowerCase();
        if (isCorrect) {
            const finishTime = Date.now() - currentSong.time;
            pl.setFinishTime(socket.id, finishTime);
            io.emit('playerfinish', { id: socket.id, time: finishTime });
        }
        callback(isCorrect);
    });

    socket.on('start', async () => {
        currentSong = await getRandomSong();
        io.emit('play');
        console.log('New song started:', currentSong.name);
    });

    socket.on('login', (username) => {
        console.log(`${username} joined the game`);
        pl.addPlayer(socket.session_id, username);
        socket.emit('redirect', '/');
    });

    socket.on('disconnect', () => {
        pl.setPlayerOnline(socket.session_id, false);
        io.emit('playerlist', pl.getPlayerList());
    });
});

app.get('/play', async (req, res) =>{
    await stream(currentSong, res);
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/html/login.html'));
});

app.get('/currentsong', (req, res) => {
    res.send(currentSong.name);

});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
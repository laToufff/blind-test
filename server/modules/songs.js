const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

function getSongList() {
    const fileList = fs.readdirSync(path.join(__dirname + '/../../songs'));
    const songList = fileList.filter(file => file.endsWith('.mp3'));
    return songList;
}

async function getSongNames() {
    let songNames = [];
    const songList = getSongList();
    for (const song of songList) {
        const filePath = path.join(__dirname + '/../../songs/'+song);
        const metadata = await mm.parseFile(filePath)
        const name = metadata.common.title;
        songNames.push(name);
    };
    return songNames;
}

async function getRandomSong() {
    const songList = getSongList();
    const randi = Math.floor(Math.random() * songList.length);

    const filePath = path.join(__dirname + '/../../songs/'+songList[randi]);
    const metadata = await mm.parseFile(filePath);
    const name = metadata.common.title;

    return {name:name, filePath:filePath, metadata:{
        bitrate:metadata.format.bitrate, 
        duration:metadata.format.duration
    }};
}

module.exports = { getSongNames, getRandomSong };
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

function getSongList() {
    const fileList = fs.readdirSync(path.join(__dirname + '/../../songs'));
    const songList = fileList.filter(file => file.endsWith('.mp3'));
    return songList;
}

async function getSongNames(callback) {
    let songNames = [];
    const songList = getSongList();
    for (const song of songList) {
        const filePath = path.join(__dirname + '/../../songs/'+song);
        const metadata = await mm.parseFile(filePath)
        const name = metadata.common.title;
        songNames.push(name);
    };
    callback(songNames);
}

module.exports = { getSongList, getSongNames };
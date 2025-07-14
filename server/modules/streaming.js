const fs = require('fs');

async function stream(song, res) {
    const bitrate = song.metadata.bitrate;
    const length = song.metadata.duration;

    const bytesPerSecond = bitrate / 8;
    const duration = 10;
    const startSec = Math.floor(Math.random() * (length - duration));
    const startByte = startSec * bytesPerSecond;
    const endByte = startByte + duration * bytesPerSecond;

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': duration * bytesPerSecond,
        'Content-Range': 'bytes ' + startByte + '-' + endByte + '/' + duration * bytesPerSecond,
        'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(song.filePath, { start: startByte, end: endByte }).pipe(res);
}

module.exports = stream;
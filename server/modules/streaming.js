const fs = require('fs');

async function stream(filePath, metadata, res) {
    const bitrate = metadata.format.bitrate;
    const length = metadata.format.duration;
    const name = metadata.common.title;

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
    fs.createReadStream(filePath, { start: startByte, end: endByte }).pipe(res);
    return name;
}

module.exports = stream;
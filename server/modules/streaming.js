const fs = require('fs');

async function stream(song, res) {
    const bitrate = song.data.bitrate;
    const duration = song.data.duration;
    const startSec = song.data.startSec;

    const bytesPerSecond = bitrate / 8;
    
    const startByte = startSec * bytesPerSecond;
    const endByte = startByte + duration * bytesPerSecond;

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': duration * bytesPerSecond,
        'Content-Range': 'bytes ' + startByte + '-' + endByte + '/' + duration * bytesPerSecond,
        'Accept-Ranges': 'bytes'
    });
    let rs = fs.createReadStream(song.filePath, { start: startByte, end: endByte });
    rs.pipe(res);
}

module.exports = stream;
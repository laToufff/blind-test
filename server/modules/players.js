let playerList = {};

function addPlayer(id, username) {
    if (!playerList[id]) {
        playerList[id] = {
            id: id,
            username: username,
            online: false,
            finishTime: -1
        };
    }
    console.log(`${username} joined the game`);
}

function removePlayer(id) {
    if (playerList[id]) {
        console.log(`${playerList[id].username} disconnected`);
        delete playerList[id];
    }
}

function resetPlayers() {
    for (const id in playerList) {
        playerList[id].finishTime = -1;
    }
}

function setFinishTime(id, time) {
    if (playerList[id]) {
        playerList[id].finishTime = time;
    }
}

function getPlayerList() {
    return Object.values(playerList).filter(player => player.online);
}

function getPlayerById(id) {
    return playerList[id] || null;
}

function setPlayerOnline(id, online) {
    if (playerList[id]) {
        playerList[id].online = online;
    }
}

module.exports = {
    addPlayer,
    removePlayer,
    resetPlayers,
    setFinishTime,
    getPlayerList,
    getPlayerById,
    setPlayerOnline
};
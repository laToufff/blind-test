let playerList = {};

function addPlayer(id, username) {
    if (!playerList[id]) {
        playerList[id] = {
            id: id,
            username: username,
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
    return Object.values(playerList);
}

module.exports = {
    addPlayer,
    removePlayer,
    resetPlayers,
    setFinishTime,
    getPlayerList
};
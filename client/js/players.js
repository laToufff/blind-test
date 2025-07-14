function updatePlayerList() {
    const playerListElement = document.getElementById('playerlist');
    playerListElement.innerHTML = '';

    playerList.forEach(player => {
        const li = document.createElement('li');
        li.id = player.id;
        li.textContent = player.username;
        playerListElement.appendChild(li);
    });
}

function setPlayerFinishTime(player) {
    const playerElement = document.getElementById(player.id);
    if (playerElement) {
        playerElement.textContent = `${playerElement.textContent} - ${(player.finishTime/1000).toFixed(1)} sec`;
        playerElement.classList.add('playerfinished');
    }
}
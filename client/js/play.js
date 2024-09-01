
var isPlaying = false;
function playAudio() {
    const audio = document.getElementById('audio');
    const audioSrc = document.getElementById('audio_src');
    const songInput = document.getElementById('songinput');
    const songDiv = document.getElementById('song');
    const resultDiv = document.getElementById('result');

    if (isPlaying) {
        return;
    }
    songInput.disabled = false;
    songInput.focus();
    songDiv.innerText = "";
    resultDiv.innerText = "";

    audioSrc.src = "http://localhost:3000/play?time=" + new Date().getTime();
    audio.load();
    audio.play();
    startCountdown();
}

function startCountdown() {
    const countdown = document.getElementById('countdown');
    const playingDiv = document.getElementById('playing');
    countdown.innerHTML = 10;
    playingDiv.innerHTML = "Playing...";
}

function updateCountdown() {
    const audio = document.getElementById('audio');
    const countdown = document.getElementById('countdown');
    const time = audio.currentTime;
    const duration = audio.duration;
    if (isNaN(Math.ceil(duration - time))) {
        return;
    }
    countdown.innerHTML = Math.ceil(duration - time);
}

async function getCurrentSong() {
    const response = await fetch('http://localhost:3000/currentsong', {method: 'GET'});
    const song = await response.text();
    return song;
}

async function timeUp() {
    const playingDiv= document.getElementById('playing');
    const songInput = document.getElementById('songinput');
    const resultDiv = document.getElementById('result');
    const songDiv = document.getElementById('song');
    const acList = document.getElementById('ac-list');

    const song = await getCurrentSong();
    songDiv.innerText = song;
    playingDiv.innerText = "Time's up!";
    songInput.value = '';
    songInput.disabled = true;
    if(acList) {
        acList.remove();
    }
    if (resultDiv.innerText !== "Correct!") {
        resultDiv.innerText = "Too slow!";
    }
}
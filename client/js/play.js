
var isPlaying = false;
function playAudio() {
    const audio = document.getElementById('audio');
    const currentSong = document.getElementById('currentsong');
    const countDown = document.getElementById('countdown');
    const audioSrc = document.getElementById('audio_src');
    const songInput = document.getElementById('songinput');
    const songDiv = document.getElementById('song');
    const resultDiv = document.getElementById('result');

    if (isPlaying) {
        return;
    }
    songInput.disabled = false;
    songDiv.innerText = "";
    resultDiv.innerText = "";

    audioSrc.src = "http://localhost:3000/play?time=" + new Date().getTime();
    audio.load();
    audio.play();

    var timeLeft = 10;
    countDown.innerHTML = timeLeft;
    currentSong.innerHTML = "Playing...";
    var timer = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            countDown.innerHTML = 0;
            fetch('http://localhost:3000/currentsong', {method: 'GET'})
                .then(response => response.text()
                .then(text => currentSong.innerHTML = "The song was : " +  text));
        } else {
            countDown.innerHTML = timeLeft;
        }
    }, 1000);
}
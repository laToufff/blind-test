let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let skipButton = document.getElementById("skip");
let countdown = document.getElementById("countdown");

const width = canvas.width;
const height = canvas.height;

let isController = true;

skipButton.addEventListener("click", () => {
    if (!isController) {
        socket.emit("start");
    }
});

function drawPlay() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(55, 25);
    ctx.lineTo(55, 175);
    ctx.lineTo(155, 100);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    isController = true;
    canvas.classList.add("controller");
    canvas.addEventListener("click", startGame);
    countdown.hidden = true;
    skipButton.hidden = true;
}

drawPlay();

function startGame() {
    if (isController) {
        startAnim();
        socket.emit("start");
    }
}

function startAnim() {
    isController = false;
        canvas.removeEventListener("click", startGame);
        canvas.classList.remove("controller");
        ctx.clearRect(0, 0, width, height);
        countdown.hidden = false;
        skipButton.hidden = false;
        requestAnimationFrame(drawWave);
}
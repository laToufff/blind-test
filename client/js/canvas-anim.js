const audio = document.getElementById('audio');
const audioContext = new window.AudioContext();

const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();
source.connect(analyser);
analyser.connect(audioContext.destination);

let gap = 2;
let barNbr = 4;

analyser.fftSize = 32;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawWave() {
    if (isController) {
        return;
    }
    ctx.clearRect(0, 0, width, height);
    
    const barWidth = (width-gap*(barNbr*2 +1))/(barNbr*2-1);
    const barDensity = 3;
    ctx.fillStyle = "black";
    
    analyser.getByteFrequencyData(dataArray);
    
    ctx.beginPath();
    for (let i = 0; i < barNbr; i++) {
        /*let barHeight = 0;
        for (let j = 0; j < barDensity; j++) {
            barHeight += dataArray[barDensity * i + j];
        }
        barHeight /= barDensity;*/
        let barHeight = dataArray[barDensity * i+6];
        barHeight = (barHeight/255) * height;
        barHeight = Math.max(10, barHeight);
        /*barHeight = barHeight - (barNbr-i) * 20;
        if (barHeight < 0) {
            barHeight = 0;
        }*/
        
        let x1 = barNbr*barWidth + gap*barNbr+1 - (i*barWidth + gap*i)-barWidth;
        ctx.roundRect(x1, (height-barHeight)/2, barWidth, barHeight, 3);
        
        if (i != barNbr) {
            let x2 = barNbr*barWidth + gap*barNbr+1 + (i*barWidth + gap*i)-barWidth;
            ctx.roundRect(x2, (height-barHeight)/2, barWidth, barHeight, 3);
        }
    }
    ctx.closePath();
    ctx.fill();
    
    if (!isController) {
        requestAnimationFrame(drawWave);
    } else {
        ctx.clearRect(0, 0, width, height);
    }
}
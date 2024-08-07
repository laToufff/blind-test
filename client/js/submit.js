let songList = [];

async function suggest() {
    const input = document.getElementById('songinput');
    const songDiv = document.getElementById('song');
    const resultDiv = document.getElementById('result');
    
    if (songList.length === 0) {
        const res = await fetch('/songs');
        songList = await res.json();
    }
    
    for (const child of input.parentNode.children) {
        if (child.id === 'ac-list') {
            child.remove();
        }
    }
    const value = input.value;
    if (value === '') {
        return;
    }
    var acList = document.createElement('div');
    acList.setAttribute('id', 'ac-list');
    acList.setAttribute('class', 'autocomplete-items');
    input.parentNode.appendChild(acList);
    let validSongs = songList.filter(song => song.toLowerCase().startsWith(value.toLowerCase()));
    for (const song of validSongs) {
        var div = document.createElement('div');
        div.innerHTML = "<strong>" + song.substr(0, value.length) + "</strong>";
        div.innerHTML += song.substr(value.length);
        div.innerHTML += "<input type='hidden' value='" + song + "'>";
        div.addEventListener('click', async function() {
            const val = this.getElementsByTagName('input')[0].value;
            const result = await submit(val);
            input.value = '';
            if (result === true) {
                songDiv.innerText = val;
                resultDiv.innerText = "Correct!";
                input.disabled = true;
            } else {
                songDiv.innerText = val;
                resultDiv.innerText = "Incorrect! Try again!";
            }
            acList.remove();
        });
        acList.appendChild(div);
    }
}

async function submit(value) {
    const submitRes = await fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ songname: value })
    });
    const result = await submitRes.json();
    return result;
}


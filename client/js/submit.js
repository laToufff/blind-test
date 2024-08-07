let songList = [];
var selectedIndex;

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
    selectedIndex = undefined;
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

function select(e) {
    const acList = document.getElementById('ac-list');
    if (acList) {
        const children = acList.children;
        if (children.length === 0) {
            return;
        }
        if (e.keyCode === 9 || e.keyCode === 40) {
            // Tab or Down Arrow
            e.preventDefault();
            if (selectedIndex === undefined) {
                selectedIndex = 0;
            } else {
                children[selectedIndex].classList.remove('selected');
                selectedIndex = (selectedIndex + 1) % children.length;
            }
            children[selectedIndex].classList.add('selected');
        } else if (e.keyCode === 13) {
            // Enter
            e.preventDefault();
            if (children.length === 1) {
                children[0].click();
            }
            if (selectedIndex !== undefined) {
                children[selectedIndex].click();
            }
        }
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


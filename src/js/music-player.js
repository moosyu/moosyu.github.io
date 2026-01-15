const playpauseBtn = document.querySelector("#play-pause");
const volumeSlider = document.querySelector(".volume_slider");
const imgElement = document.querySelector(".cd-rotate > img");
const cdImage = document.querySelector(".cd-image");
const cdTitle = document.querySelector(".cd-title");
const cdLink = document.querySelector(".cd-link");
const baseVolume = 0.2;

let isPlaying = false;
let curr_track = document.createElement("audio");
let trackLoaded = false;

cdImage.src = "https://i.imgur.com/twC2FbB.png";
cdTitle.textContent = "All My Friends - LCD Soundsystem";
cdLink.setAttribute("href", "https://www.youtube.com/watch?v=aygY5OqMuKE");

function loadTrack() {
    curr_track.src = "https://files.catbox.moe/rmhd9e.mp3";
    curr_track.load();
    curr_track.loop = true;
    curr_track.volume = baseVolume;
    volumeSlider.value = baseVolume * 100;
    trackLoaded = true;
}

function playpauseTrack() {
    if (isPlaying) {
        curr_track.pause();
        isPlaying = false;
        playpauseBtn.innerHTML = '▶';
        imgElement.classList.remove('spin-animation');
    } else {
        if (!trackLoaded) {
            loadTrack();
        }
        curr_track.play();
        isPlaying = true;
        playpauseBtn.innerHTML = '||';
        imgElement.classList.add('spin-animation');

    }
}

function setVolume() {
    curr_track.volume = volumeSlider.value / 100;
}

function switchVol(volumeChange) {
    console.log(Number(volumeSlider.value) + volumeChange);
    curr_track.volume = (Number(volumeSlider.value) + volumeChange) / 100
    volumeSlider.value = curr_track.volume * 100;
}

function getCurrentRotation(el) {
    const st = window.getComputedStyle(el);
    const transform = st.getPropertyValue("transform");

    if (transform === "none") return 0;

    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];

    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

volumeSlider.addEventListener('input', setVolume);

loadTrack();
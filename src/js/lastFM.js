const lastFMContainer = document.getElementById("lastHeardContainer");
const textEl = lastFMContainer.querySelector("p");

async function displayLastFM() {
    try {
        const response = await fetch('https://lastfm-last-played.biancarosa.com.br/moosyu/latest-song');
        const data = await response.json();
        const track = data.track;

        if (lastFMContainer) {
            textEl.innerHTML = `Last heard: <a target="_blank" href="${track.url}">${track.name}</a> by ${track.artist['#text']}`
        }
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayLastFM();
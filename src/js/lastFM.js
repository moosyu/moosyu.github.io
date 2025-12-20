async function displayLastFM() {
    try {
        const response = await fetch('https://lastfm-last-played.biancarosa.com.br/moosyu/latest-song');
        const data = await response.json();
        const track = data.track;

        document.getElementById("lastHeardContainer").innerHTML = `
        <div id="trackInfo">
            <span>Last heard: <a target="_blank" href="${track.url}">${track.name}</a> by ${track.artist['#text']}</span>
        </div>`;
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayLastFM();
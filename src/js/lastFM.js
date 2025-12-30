async function displayLastFM() {
    try {
        const response = await fetch('https://lastfm-last-played.biancarosa.com.br/moosyu/latest-song');
        const data = await response.json();
        const track = data.track;

        document.getElementById("lastHeardContainer").innerHTML = `
            <p>Last heard: <a target="_blank" href="${track.url}">${track.name}</a> by ${track.artist['#text']}</p>
        `
    } catch (error) {
        console.error("Fetching failed: ", error);
    }
};

displayLastFM();
async function displayLatestGithubCommit() {
    try {
        const response = await fetch('https://api.github.com/repos/Moosyu/moosyu.github.io/commits?per_page=1');
        const data = await response.json();
        const sha = data[0].sha;
        const shortSha = sha.substring(0, 7);
        const authorDate = new Date(data[0].commit.author.date);

        document.getElementById("commitsContainer").innerHTML = `
        <div id="commitDiv">
            <span>Latest commit: <a target="_blank" href="https://github.com/Moosyu/moosyu.github.io/commit/${sha}">${shortSha}</a> on ${authorDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
        </div>`;
    } catch (error) {
        console.error("Fetching Github latest commit failed:", error);
    }
};

displayLatestGithubCommit();
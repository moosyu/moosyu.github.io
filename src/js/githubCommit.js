const commitsContainer = document.getElementById("commitsContainer");
const textEl = commitsContainer.querySelector("p");

async function displayLatestGithubCommit() {
    try {
        const response = await fetch('https://api.github.com/repos/Moosyu/moosyu.github.io/commits?per_page=1');
        const data = await response.json();
        const sha = data[0].sha;
        const shortSha = sha.substring(0, 7);
        const authorDate = new Date(data[0].commit.author.date);

        if (commitsContainer) {
            textEl.innerHTML = `Latest commit: <a target="_blank" href="https://github.com/Moosyu/moosyu.github.io/commit/${sha}">${shortSha}</a> on ${authorDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}`;
        }
    } catch (error) {
        console.error("Fetching Github latest commit failed:", error);
    }
};

displayLatestGithubCommit();
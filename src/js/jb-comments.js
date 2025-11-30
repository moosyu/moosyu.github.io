const comment_section = document.getElementById("comment-section");
async function displayComments() {
        try {
            const response = await fetch("https://cmt.nkko.link/api/moosyu.github.io/pages/guestbook");
            const data = await response.json();

            comments = data.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) });

            comments.forEach((comment) => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment-item");

                const dateDiv = document.createElement("div");
                const createdAtDate = new Date(comment.createdAt)
                const formattedDate = createdAtDate.toLocaleString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
                dateDiv.innerHTML = `<span class="comment-title">Date</span> ${formattedDate}`

                const nameDiv = document.createElement("div");
                nameDiv.innerHTML = `<span class="comment-title">Name</span> ${comment.author}`;

                const urlDiv = document.createElement("div");
                if (comment.website) {
                    urlDiv.innerHTML = `<span class="comment-title">URL</span> <a href="${comment.website}">${comment.website}</a>`;
                } else {
                    urlDiv.textContent = "No website URL included!";
                }

                const contentDiv = document.createElement("div");
                contentDiv.textContent = `${comment.content}`;

                commentDiv.append(dateDiv, nameDiv, urlDiv, contentDiv);
                comment_section.append(commentDiv);
            });
        } catch (error) {
            console.error("comments failed to load: " + error);
        }
}

displayComments()
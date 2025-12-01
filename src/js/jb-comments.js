const comment_section = document.getElementById("comment-section");
const comment_entry_form = document.getElementById("comment-entry-form")
const pageName = window.location.pathname;
const pageURL = `moosyu.github.io${pageName}`;

comment_entry_form.innerHTML = displayFormHTML(null);

async function displayComments() {
        try {
            const response = await fetch(`https://cmt.nkko.link/api/${pageURL}`);
            const data = await response.json();

            // clears loading message
            if (data === undefined || data.length == 0) {
                comment_section.innerHTML = "<div class='comment-item'>There aren't any comments yet :(</div>";
            } else {
                comment_section.innerHTML = "";
                const comments = data.sort((a, b) => { 
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                comments.forEach(comment => {
                    parentComment = displayEntry(comment, "comment", comment.id, comment.replies.length > 0);
                    if (comment.replies) {
                        const replies = comment.replies.sort((a, b) => {
                            return new Date(a.createdAt) - new Date(b.createdAt);
                        });
                        replies.forEach(reply => {
                            parentComment.append(displayEntry(reply, "reply", reply.id, comment.replies.length > 0));
                        });
                    }
                    comment_section.append(parentComment);
                });
            }
        } catch (error) {
            comment_section.innerHTML = `Comments failed to load: ${error}`;
            console.error(`Comments failed to load: ${error}`);
        }
}

// this part makes me wish i used ts but whatever...
function displayEntry(entry, typeName, entryID, hasReplies) {
    const entryDiv = document.createElement("div");
    entryDiv.id = `entry-${entryID}`;
    entryDiv.classList.add(`${typeName}-item`);
    if (typeName == "reply") {
        entryDiv.classList.add("hidden")
    }

    // comment date
    const createdAtDate = new Date(entry.createdAt);
    const formattedDate = createdAtDate.toLocaleString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    entryDiv.innerHTML = `
        <table>
            <tr>
                <td class="comment-title">Date</td>
                <td>${formattedDate}</td>
            </tr>
            <tr>
                <td class="comment-title">Name</span></td>
                <td>${entry.author}</td>
            </tr>
            <tr>
                <td class="comment-title">URL</td>
                <td>${entry.website ? `<a href="${entry.website}">${entry.website}</a>` : "No website URL included"}</td>
            </tr>
        </table>
        <span class="comment-content">${entry.content}</span>
        <div class="comment-footer"></div>
    `;

    // footer content
    const commentFooter = entryDiv.querySelector(".comment-footer");
    if (typeName == "comment") {
        commentFooter.append(createReplyBtn(entryID));
        if (hasReplies) {
            const viewCommentsDiv = document.createElement("div");
            viewCommentsDiv.id = `view-comments-${entryID}`;
            viewCommentsDiv.innerHTML = displayViewComments(entryID, true);
            commentFooter.append(viewCommentsDiv);
        }
    }

    return entryDiv;
}

function createReplyBtn(entryID) {
    const replyDiv = document.createElement("div");
    replyDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
        <button class="reply-button" onclick="displayReplyEntry('${entryID}')">Reply</button>
    `;
    return replyDiv;
}

function showReplies(entryID) {
    const parentEntry = document.getElementById(`entry-${entryID}`);
    const replies = parentEntry.querySelectorAll(".reply-item");
    const viewBtn = document.getElementById(`view-comments-${entryID}`);
    const isHidden = replies[0].classList.contains("hidden");

    replies.forEach(reply => {
        reply.classList.toggle("hidden", !isHidden)
    });
    viewBtn.innerHTML = displayViewComments(entryID, !isHidden);
}


function displayReplyEntry(entryID) {
    const parentEntry = document.getElementById(`entry-${entryID}`);
    const replyEntry = parentEntry.querySelector(".reply-entry");
    
    if (replyEntry) {
        if (replyEntry.classList.contains("hidden")) {
            replyEntry.classList.remove("hidden")
        } else {
            replyEntry.classList.add("hidden")
        }
    } else {
        const replyDiv = document.createElement("div");
        replyDiv.classList.add("reply-entry");
        replyDiv.innerHTML = displayFormHTML(entryID);

        const commentFooter = parentEntry.querySelector(".comment-footer");
        commentFooter.insertAdjacentElement("afterend", replyDiv);
    }
}

function displayViewComments(entryID, hidden) {
    if (hidden) {
        return `<svg fill="#fff" width="16" height="16" viewBox="0 -16 544 544" xmlns="http://www.w3.org/2000/svg"><path d="M272 400q-67 0-121-39-55-39-87-105 32-66 87-105 54-39 121-39 64 0 120 41 56 40 88 103-32 63-88 104-56 40-120 40m0-48q40 0 68-28t28-68-28-68-68-28-68 28-28 68 28 68 68 28m0-40q-23 0-39-16-17-17-17-40t17-39q16-17 39-17t40 17q16 16 16 39t-16 40q-17 16-40 16"/></svg>
        <button class="reply-button" onclick="showReplies('${entryID}')">View replies</button>`;
    } else {
        return `<svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.765 6.076a.5.5 0 0 1 .159.689 9.5 9.5 0 0 1-1.554 1.898l1.201 1.201a.5.5 0 0 1-.707.707l-1.263-1.263a8.5 8.5 0 0 1-2.667 1.343l.449 1.677a.5.5 0 0 1-.966.258l-.458-1.709Q8.25 11 7.5 11t-1.46-.123l-.457 1.71a.5.5 0 1 1-.966-.26l.45-1.676a8.5 8.5 0 0 1-2.668-1.343l-1.263 1.263a.5.5 0 1 1-.707-.707l1.2-1.201A9.5 9.5 0 0 1 .077 6.765a.5.5 0 0 1 .848-.53 8.4 8.4 0 0 0 1.77 2.034A7.46 7.46 0 0 0 7.5 9.999c2.808 0 5.156-1.493 6.576-3.764a.5.5 0 0 1 .689-.16" fill="#FFF"/></svg>
        <button class="reply-button" onclick="showReplies('${entryID}')">Hide replies</button>`;

    }
}

function displayFormHTML(entryID) {
    return `
        <form method="POST" action="https://cmt.nkko.link/api/${pageURL}">
            ${entryID ? `<input type="hidden" name="parentId" value="${entryID}">` : ""}
    
            <div>
                <input type="text" maxlength="64" name="name" placeholder="Enter your name..." required/>
                <br>
                <input type="url" maxlength="64" name="website" placeholder="Enter your site (optional)..." />
            </div>
    
            <textarea name="content" maxlength="1024" placeholder="Enter your comment..." required></textarea>
            <br>
            <button class="submit-button">Send</button>
        </form>
    `;
}

displayComments()
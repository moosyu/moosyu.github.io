const comment_section = document.getElementById("comment-section");
const comment_entry_form = document.getElementById("comment-entry-form");
const pageName = window.location.pathname;
const pageURL = `moosyu.github.io${pageName}`;

comment_entry_form.innerHTML = displayFormHTML(null);

async function displayComments() {
        try {
            const response = await fetch(`https://cmt.nkko.link/api/${pageURL}`);
            const data = await response.json();

            if (data === undefined || data.length == 0) {
                comment_section.innerHTML = "<div class='comment-item'>There aren't any comments yet :(</div>";
            } else {
                comment_section.innerHTML = "";
                const comments = data.sort((a, b) => { 
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                comments.forEach(comment => {
                    if (comment.approved) {
                        const parentComment = displayEntry(comment, "comment", comment.id, comment.replies.length > 0);
                        if (comment.replies) {
                            const replies = comment.replies.sort((a, b) => {
                                return new Date(a.createdAt) - new Date(b.createdAt);
                            });
                            replies.forEach(reply => {
                                if (reply.approved) {
                                    const footerContent = parentComment.querySelector(".comment-footer-content");
                                    footerContent.append(displayEntry(reply, "reply", reply.id, comment.replies.length > 0));
                                }
                            });
                        }
                        comment_section.append(parentComment);
                    }
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
        <span class="comment-content">${filterContent(entry.content)}</span>
        <div class="comment-footer"></div>
        <div class="comment-footer-content"></div>
    `;

    // footer content
    const commentFooter = entryDiv.querySelector(".comment-footer");
    if (typeName == "comment") {
        commentFooter.append(createReplyBtn(entryID));
        if (hasReplies) {
            const viewCommentsDiv = document.createElement("div");
            viewCommentsDiv.id = `view-comments-${entryID}`;
            viewCommentsDiv.innerHTML = createViewCommentsBtn(entryID, true);
            commentFooter.append(viewCommentsDiv);
        }
    }

    return entryDiv;
}

function filterContent(content) {
    // exploded all over the place after making this you guys have no idea
    return content.replace(
        /:(smile|annoyed|talk|pissed|nervous|cool|exclaim|sad|freak|grahh|sobbing|blunder):/g,
        (_, name) => `<img src="/assets/emojis/${name}.webp" class="c-emoji" alt="${name}">`
    );
}

function createEmojiBtn(entryID) {
    return `
    <svg onclick="displayEmojis('${entryID}')" fill="#fff" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 52 52" xml:space="preserve"><path d="M50.1 26c0 13.3-10.8 24.1-24.1 24.1S1.9 39.3 1.9 26 12.7 1.9 26 1.9 50.1 12.7 50.1 26M18.3 15.8c-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3m15.5 0c-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3m-.2 16.7c-2 1.8-4.7 2.8-7.6 2.8-2.8 0-5.4-1-7.5-2.7l-.9-.8c-.3-.2-.5-.3-1.1-.3-1.1 0-1.9.9-1.9 1.9 0 .5.2 1 .6 1.4l.7.6c2.7 2.4 6.3 3.8 10.1 3.8 3.9 0 7.5-1.5 10.2-3.9l.5-.5c.4-.4.6-.9.6-1.4 0-1.1-.9-1.9-1.9-1.9-.5 0-.9.2-1.2.4z"/></svg>
    `;
}

function createReplyBtn(entryID) {
    const replyDiv = document.createElement("div");
    replyDiv.innerHTML = `
    <div onclick="displayReplyEntry('${entryID}')" class="collapsible-div">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
        <button class="collapsible-button">Reply</button>
    </div>
    `;
    return replyDiv;
}

function createViewCommentsBtn(entryID, hidden) {
    if (hidden) {
        return `
        <div onclick="displayReplies('${entryID}')" class="collapsible-div">
            <svg fill="#fff" width="16" height="16" viewBox="0 -16 544 544" xmlns="http://www.w3.org/2000/svg"><path d="M272 400q-67 0-121-39-55-39-87-105 32-66 87-105 54-39 121-39 64 0 120 41 56 40 88 103-32 63-88 104-56 40-120 40m0-48q40 0 68-28t28-68-28-68-68-28-68 28-28 68 28 68 68 28m0-40q-23 0-39-16-17-17-17-40t17-39q16-17 39-17t40 17q16 16 16 39t-16 40q-17 16-40 16"/></svg>
            <button class="collapsible-button">View replies</button>
        </div>`;
    } else {
        return `
        <div onclick="displayReplies('${entryID}')" class="collapsible-div">
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.765 6.076a.5.5 0 0 1 .159.689 9.5 9.5 0 0 1-1.554 1.898l1.201 1.201a.5.5 0 0 1-.707.707l-1.263-1.263a8.5 8.5 0 0 1-2.667 1.343l.449 1.677a.5.5 0 0 1-.966.258l-.458-1.709Q8.25 11 7.5 11t-1.46-.123l-.457 1.71a.5.5 0 1 1-.966-.26l.45-1.676a8.5 8.5 0 0 1-2.668-1.343l-1.263 1.263a.5.5 0 1 1-.707-.707l1.2-1.201A9.5 9.5 0 0 1 .077 6.765a.5.5 0 0 1 .848-.53 8.4 8.4 0 0 0 1.77 2.034A7.46 7.46 0 0 0 7.5 9.999c2.808 0 5.156-1.493 6.576-3.764a.5.5 0 0 1 .689-.16" fill="#FFF"/></svg>
            <button class="collapsible-button">Hide replies</button>
        </div>`;
    }
}

function displayReplyEntry(entryID) {
    const parentEntry = document.getElementById(`entry-${entryID}`);
    const replyEntry = parentEntry.querySelector(".reply-entry");
    
    if (replyEntry) {
        if (replyEntry.classList.contains("hidden")) {
            replyEntry.classList.remove("hidden");
        } else {
            replyEntry.classList.add("hidden");
        }
    } else {
        const replyDiv = document.createElement("div");
        replyDiv.classList.add("reply-entry");
        replyDiv.innerHTML = displayFormHTML(entryID);

        const commentFooter = parentEntry.querySelector(".comment-footer");
        commentFooter.insertAdjacentElement("afterend", replyDiv);
    }
}

function displayReplies(entryID) {
    const parentEntry = document.getElementById(`entry-${entryID}`);
    const replies = parentEntry.querySelectorAll(".reply-item");
    const viewBtn = document.getElementById(`view-comments-${entryID}`);
    const isHidden = replies[0].classList.contains("hidden");

    replies.forEach(reply => {
        reply.classList.toggle("hidden", !isHidden);
    });
    viewBtn.innerHTML = createViewCommentsBtn(entryID, !isHidden);
}

function displayEmojis(entryID) {
    const emojiPanel = document.getElementById(`emojis-${entryID}`);
    if (emojiPanel.classList.contains("hidden")) {
        emojiPanel.classList.remove("hidden");
    } else {
        emojiPanel.classList.add("hidden");
    }
}

function addEmoji(emojiName, entryID) {
    const textContent = document.getElementById(`text-content-${entryID}`);
    const cursorPos = textContent.selectionStart;
    const textBefore = textContent.value.substring(0, cursorPos);
    const textAfter = textContent.value.substring(cursorPos, textContent.value.length);

    textContent.value = textBefore + ` :${emojiName}: ` + textAfter;
    textContent.focus();
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
            <textarea id="text-content-${entryID}" name="content" maxlength="1024" placeholder="Enter your comment..." required></textarea>
            <br>
            <div class="emoji-panel hidden" id="emojis-${entryID}">
                <img class="emoji-listed" src="/assets/emojis/smile.webp" alt=":smile:" onclick="addEmoji('smile', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/annoyed.webp" alt=":annoyed:" onclick="addEmoji('annoyed', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/talk.webp" alt=":talk:" onclick="addEmoji('talk', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/pissed.webp" alt=":pissed:" onclick="addEmoji('pissed', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/nervous.webp" alt=":nervous:" onclick="addEmoji('nervous', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/cool.webp" alt=":cool:" onclick="addEmoji('cool', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/exclaim.webp" alt=":exclaim:" onclick="addEmoji('exclaim', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/sad.webp" alt=":sad:" onclick="addEmoji('sad', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/freak.webp" alt=":freak:" onclick="addEmoji('freak', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/grahh.webp" alt=":grahh:" onclick="addEmoji('grahh', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/sobbing.webp" alt=":sobbing:" onclick="addEmoji('sobbing', '${entryID}')">
                <img class="emoji-listed" src="/assets/emojis/blunder.webp" alt=":blunder:" onclick="addEmoji('blunder', '${entryID}')">
            </div>
            <div class="form-buttons">
                <button class="submit-button">Send</button>
                ${createEmojiBtn(entryID)}
            </div>
        </form>
    `;
}

displayComments();
import "./achievements/exampleGlobal.js";

// The time before the popup begins disappearing (in milliseconds)
const popupTimeout = 8000;

// Edit the code inside the `` the same way you would normal HTML
function displayPopupHTML(achievement) {
    return `
    <img src=${achievement.iconName}>
    <div>
        <p>You got an achievement!!</p>
        <p>${achievement.name}: ${achievement.description}</p>
    </div>`;
}

// Don't edit below this point if you don't know JS

// Function to convert string to slug (for using name as psuedo-id)
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9']+/g, "-")
        .replace(/'/g, "-")
        .replace(/(^-|-$)/g, "");
}

let achievementQueue = [];

function achievementPopup() {
    console.log(achievementQueue);
    const popupDiv = document.createElement("div");
    popupDiv.classList.add("achievement-popup");
    popupDiv.innerHTML = displayPopupHTML(achievementQueue[achievementQueue.length - 1]);
    document.body.append(popupDiv);

    requestAnimationFrame(() => {
        popupDiv.classList.add("show");
    });
    setTimeout(() => {
        popupDiv.classList.remove("show");
        popupDiv.classList.add("hide");
        popupDiv.addEventListener("animationend", () => {
            popupDiv.remove();
        });
        achievementQueue.pop();
        if (!achievementQueue.length == 0) {
            achievementPopup()
        }
    // Time in ms before the achievement popup disappears
    }, popupTimeout);
}

export function updateAchievements(achievement) {
    const storedAchievements = localStorage.getItem("achievements");
    let savedAchievements = storedAchievements ? JSON.parse(storedAchievements) : [];

    if (!isAchievementUnlocked(achievement)) {
        savedAchievements.push(achievement);
        achievementQueue.push(achievement);
        localStorage.setItem("achievements", JSON.stringify(savedAchievements));
        achievementPopup();
    }
}

export function isAchievementUnlocked(achievement) {
    const storedAchievements = localStorage.getItem("achievements");
    const savedAchievements = storedAchievements ? JSON.parse(storedAchievements) : [];
    return savedAchievements.some(achievementEl => slugify(achievementEl.name) === slugify(achievement.name));
}
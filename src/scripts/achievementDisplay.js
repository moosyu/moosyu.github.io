// Edit the code inside the `` the same way you would normal HTML
function displayAchievementItem(achievement) {
    return `
    <img src=${achievement.iconName}>
    <div>
        <p>${achievement.name}</p>
        <p>${achievement.description}</p>
    </div>
    `;
}

// Don't edit below this point if you don't know JS

import { achievements } from "./achievementList.js";
import { isAchievementUnlocked } from "./achievementManager.js";

let achievementsContainer = document.getElementById("achievements-container");


Object.values(achievements).forEach((achievement) => {
    const achievementDiv = document.createElement("div");
    achievementDiv.classList.add("achievement-grid-item");

    if (!isAchievementUnlocked(achievement)) {
        achievementDiv.classList.add("achievement-grid-item-disabled");
    }

    // Edit this in the same way you would write normal HTML, this is for the popup
    achievementDiv.innerHTML = displayAchievementItem(achievement);
    achievementsContainer.append(achievementDiv);
});
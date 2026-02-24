import { updateAchievements } from "../achievementManager.js";
import { achievements } from "../achievementList.js"

const linksClickedNum = Number(localStorage.getItem("linksClicked"));

function incrementLinkCounter(currentCount) {
    return (Number(currentCount) + 1).toString();
}

document.addEventListener("DOMContentLoaded", () => {
    if (linksClickedNum >= 10) {
        updateAchievements(achievements.exampleGlobalAchievement);
    }
});

document.addEventListener("click", function (event) {
    const link = event.target.closest("a");
    if (!link) return;
    if (localStorage.getItem("linksClicked")) {
        localStorage.setItem("linksClicked", incrementLinkCounter(linksClickedNum));
    } else {
        localStorage.setItem("linksClicked", incrementLinkCounter(0));
    }
});
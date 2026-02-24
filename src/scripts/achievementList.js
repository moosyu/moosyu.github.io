// Path to where you store your achievement icons from root
const achievementIconsPath = "/assets/achievement_manager/";

export const achievements = {
    exampleAchievement: {
        name: "Woah...",
        description: "You did it",
        iconName: `${achievementIconsPath}example-icon.png`
    },
    exampleGlobalAchievement: {
        name: "Global",
        description: "You got a global achievement!",
        iconName: `${achievementIconsPath}example-icon-2.png`
    },
}
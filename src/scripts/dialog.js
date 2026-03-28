let currentDialog;

function generateDialogBox(initialDialog, dialogData) {
    currentDialog = initialDialog;
    const dialogContainer = document.getElementById("dialogContainer");
    const dialogInfo = document.createElement("div");
    const dialogBox = document.createElement("div");
    const dialogName = document.createElement("div");
    const dialogOptions = document.createElement("div");
    const dialogProfile = document.createElement("img");
    const dialogNameText = document.createElement("p");
    const dialogText = document.createElement("p");

    if (initialDialog.profile) {
        dialogProfile.src = initialDialog.profile;
    }
    dialogNameText.textContent = initialDialog.name;
    dialogText.textContent = initialDialog.text;

    dialogInfo.classList.add("dialog-info");
    dialogBox.classList.add("dialog-box");
    dialogName.classList.add("dialog-name");
    dialogProfile.classList.add("dialog-profile");
    dialogText.classList.add("dialog-text");
    dialogOptions.classList.add("dialog-options");

    dialogContainer.append(dialogInfo);
    dialogContainer.append(dialogBox);
    dialogInfo.append(dialogName);
    dialogInfo.append(dialogProfile);
    dialogName.append(dialogNameText);
    dialogBox.append(dialogText);

    toggleMissingOptions(initialDialog, dialogInfo, dialogName, dialogProfile);

    dialogBox.addEventListener("click", () => {
        if (currentDialog.next && dialogData[currentDialog.next]) {
            transitionDialog(currentDialog, dialogData[currentDialog.next])
        }
    })
}

function transitionDialog(oldDialog, newDialog) {
    if (oldDialog.name != newDialog.name) document.querySelector(".dialog-name").textContent = newDialog.name;
    // perhaps do this step on the previous to avoid time taken as image loads
    if (oldDialog.profile != newDialog.profile) document.querySelector(".dialog-profile").src = newDialog.profile;
    document.querySelector(".dialog-text").textContent = newDialog.text;
    currentDialog = newDialog;
}

async function fetchDialog() {
    try {
        const response = await fetch("../dialog.json");
        const result = await response.json();
        generateDialogBox(result.message_0, result);
    } catch (error) {
        console.error(`Dialog failed to fetch: ${error}`);
    }
}

function toggleMissingOptions(dialog, dialogInfo, dialogName, dialogProfile) {
    dialog.name || dialog.profile ? dialogInfo.classList.remove("hidden") : dialogInfo.classList.add("hidden");

    dialog.name ? dialogName.classList.remove("hidden") : dialogName.classList.add("hidden");

    dialog.profile ? dialogProfile.classList.remove("hidden") : dialogProfile.classList.add("hidden");
}

fetchDialog();
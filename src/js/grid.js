const TILE_SIZE = 250;
const BUFFER = 4;
const DRAG_THRESHOLD = 5;
const viewport = document.getElementById("viewport");
const grid = document.getElementById("grid");
const tiles = [];
const cols = Math.ceil(window.innerWidth / TILE_SIZE) + BUFFER;
const rows = Math.ceil(window.innerHeight / TILE_SIZE) + BUFFER;

let offsetX = 0;
let offsetY = 0;
let isDragging  = false;
let isMouseDown = false;
let startX, startY, lastHovered, lastSelected;

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        grid.appendChild(tile);
        tiles.push(tile);
    }
}

viewport.addEventListener("pointerdown", e => {
	isMouseDown = true;
	startX = e.clientX;
	startY = e.clientY;
});

viewport.addEventListener("pointerup", () => {
	if (!isDragging) { // single click
		console.log(lastSelected);
		console.log(lastHovered);
		if (lastSelected != null && lastHovered.id.includes("webtile")) {
			lastSelected.classList.remove("selected-tile");
			lastHovered.classList.add("selected-tile");
		} else if (lastSelected == null) {
			lastHovered.classList.add("selected-tile");
		}

		if (lastHovered.id.includes("webtile")) {
			lastSelected = lastHovered;
		}

		if (!viewport.querySelector(".tile-panel")) {
			const selectedTilePanel = document.createElement("div");
			viewport.append(selectedTilePanel);
			selectedTilePanel.classList.add("tile-panel");
			selectedTilePanel.style.left = `${lastSelected.getBoundingClientRect().x}px`;
			selectedTilePanel.style.top = `${lastSelected.getBoundingClientRect().y + 225}px`; // why do i need to add 225? we'll never know.
			selectedTilePanel.innerHTML = `
			<div class="tile-panel-content">
				<span class="title-panel-details">${lastSelected.textContent}</span>
				<div>
					<span onclick="fakeAlert()">Claim</span>
					<span onclick="clipboardCopy()">Copy</span>
					<span id="tile-panel-close">×</span>
				</div>
			</div>
			`;
		} else {
			// worst code ever? (i cant be bothered anymore)
			if (lastHovered.id.includes("webtile") || lastHovered.id == "tile-panel-close") {
				viewport.querySelector(".tile-panel").remove();
				lastSelected.classList.remove("selected-tile");
			}
		}
	}
	isMouseDown = false;
	isDragging = false;
});

viewport.addEventListener("pointermove", e => {
	if (!isMouseDown) {
	    if (lastHovered != e.target && !isDragging) {
	        lastHovered = e.target;
	    }
	    return;
	}

    if (!isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
            return;
        }

        isDragging = true;

	    if (lastSelected) {
			lastSelected.classList.remove("selected-tile");
			if (viewport.querySelector(".tile-panel")) {
				viewport.querySelector(".tile-panel").remove();
			}
	    }
    }

	offsetX -= e.clientX - startX;
	offsetY -= e.clientY - startY;
	startX = e.clientX;
	startY = e.clientY;
	updateTiles();
});

viewport.addEventListener("mouseleave", () => {
    isMouseDown = false;
    isDragging = false;
});

function fakeAlert() {
	alert(`psst, this isn't the real webtiles, don't tell anyone!`);
}

function clipboardCopy() {
	let tileDOM = lastSelected.outerHTML.replace(/\sstyle="[^"]*"/, ""); // removing the positioning style
	navigator.clipboard.writeText(tileDOM);
	alert("tile copied to clipboard (but why?");
}

function updateTiles() {
    const startCol = Math.floor(offsetX / TILE_SIZE);
    const startRow = Math.floor(offsetY / TILE_SIZE);
    let i = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tile = tiles[i++];
            const worldX = (startCol + x) * TILE_SIZE;
            const worldY = (startRow + y) * TILE_SIZE;
            tile.style.transform = `
                translate(
                ${worldX - offsetX}px,
                ${worldY - offsetY}px
                )
            `;
            tile.textContent = `Free tile ${startCol + x}, ${startRow + y}`;
            tile.id = `webtile-${startCol + x}-${startRow + y}`;
        }
    }
}

updateTiles();
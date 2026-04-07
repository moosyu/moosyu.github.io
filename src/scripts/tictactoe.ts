type GameBoard = {
  turn: number;
  gameOver: boolean;
  domCells: HTMLSpanElement[][];
  lastMoveCoordinates: number[];
  generateBoard(): void;
  aiTurn(): void;
  checkThreeInARow(): void;
};

const ticTacToe = document.getElementById("tictactoe");
const gameBoard: GameBoard = {
    turn: 0,
    gameOver: false,
    domCells: Array.from({ length: 3 }, () => Array(3).fill(null)),
    lastMoveCoordinates: [],
    generateBoard() {
        ticTacToe.replaceChildren();
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.position = "relative";
        for (let i = 0; i < 3; i++) {
            const tableRow = document.createElement("tr");
            for (let k = 0; k < 3; k++) {
                const tableData = document.createElement("td");
                tableData.style.border = "1px solid #fff";
                tableData.style.padding = "75px";
                tableData.style.cursor = "pointer";
                tableData.style.position = "relative";

                const tableSymbol = document.createElement("span");
                tableSymbol.style.position = "absolute";
                tableSymbol.style.top = "50%";
                tableSymbol.style.left = "50%";
                tableSymbol.style.transform = "translate(-50%, -50%)";

                // row -> column
                this.domCells[i][k] = tableSymbol;

                if (!this.gameOver) {
                    tableData.addEventListener("click", () => {
                        if (tableSymbol.dataset.preview == "true" && this.turn % 2 == 0) {
                            tableSymbol.textContent = "X";
                            tableSymbol.dataset.preview = "false"
                            tableSymbol.style.opacity = "1";

                            this.domCells[i][k] = tableSymbol;
                            this.lastMoveCoordinates = [i, k];
                            this.checkThreeInARow();
                            this.turn++;
                            this.aiTurn();
                        }
                    });

                    tableData.addEventListener("mouseenter", () => {
                        if (!tableSymbol.textContent) {
                            tableSymbol.textContent = "X";
                            tableSymbol.dataset.preview = "true";
                            tableSymbol.style.opacity = "0.5";
                        }
                    });

                    tableData.addEventListener("mouseleave", () => {
                        if (tableSymbol.dataset.preview == "true") {
                            tableSymbol.textContent = "";
                            tableSymbol.dataset.preview = "false";
                            tableSymbol.style.opacity = "1";
                        }
                    });
                }

                tableData.append(tableSymbol);
                tableRow.append(tableData);
            }
            table.append(tableRow);
        }
        ticTacToe.append(table);
    },
    aiTurn() {
        if (!this.gameOver) {
            for (let i = 0; i < 3; i++) {
                for (let k = 0; k < 3; k++) {
                    let currentCell = this.domCells[i][k];
                    if (!currentCell.textContent) {
                        currentCell.textContent = "O";
                        this.checkThreeInARow();
                        this.turn++;
                        return;
                    }
                }
            }
        }
    },
    checkThreeInARow() {
        const r = this.lastMoveCoordinates[0];
        const c = this.lastMoveCoordinates[1];
        const val = this.domCells[r][c]?.textContent;

        if (!val) return;

        let player: boolean = this.turn % 2 == 0;

        // row
        if (this.domCells[r][0]?.textContent === val && this.domCells[r][1]?.textContent === val && this.domCells[r][2]?.textContent === val) {
            console.log(`Row win for ${player ? "player" : "ai"}`);
            this.gameOver = true;
        }

        // column
        if (this.domCells[0][c]?.textContent === val && this.domCells[1][c]?.textContent === val &&this.domCells[2][c]?.textContent === val) {
            console.log(`Column win for ${player ? "player" : "ai"}`);
            this.gameOver = true;
        }

        // diagonal
        if (this.domCells[0][0]?.textContent === val && this.domCells[1][1]?.textContent === val && this.domCells[2][2]?.textContent === val || this.domCells[0][2]?.textContent === val && this.domCells[1][1]?.textContent === val && this.domCells[2][0]?.textContent === val) {
            console.log(`Diagonal win for ${player ? "player" : "ai"}`);
            this.gameOver = true;
        }

        if (this.gameOver) {
            const darkOverlay = document.createElement("div");
            darkOverlay.style.position = "absolute";
            darkOverlay.style.inset = "0";
            darkOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            document.querySelector("table").append(darkOverlay);
        }
    }
}

gameBoard.generateBoard();
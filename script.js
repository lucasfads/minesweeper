class Minesweeper {
	static NUMBER_MASK = 0b1111;		// 00001111 = 15
	static BOMB_MASK = 0b10000;			// 00010000 = 16
	static REVEALED_MASK = 0b100000;	// 00100000 = 32
	static FLAG_MASK = 0b1000000;		// 01000000 = 64
	static BOMB_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-bomb"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.499 3.996a2.2 2.2 0 0 1 1.556 .645l3.302 3.301a2.2 2.2 0 0 1 0 3.113l-.567 .567l.043 .192a8.5 8.5 0 0 1 -3.732 8.83l-.23 .144a8.5 8.5 0 1 1 -2.687 -15.623l.192 .042l.567 -.566a2.2 2.2 0 0 1 1.362 -.636zm-4.499 5.004a4 4 0 0 0 -4 4a1 1 0 0 0 2 0a2 2 0 0 1 2 -2a1 1 0 0 0 0 -2z" /><path d="M21 2a1 1 0 0 1 .117 1.993l-.117 .007h-1c0 .83 -.302 1.629 -.846 2.25l-.154 .163l-1.293 1.293a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.293 -1.292c.232 -.232 .375 -.537 .407 -.86l.007 -.14a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" /></svg>`;
	static FLAG_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-flag"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z" /></svg>`;
	static WRONG_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`;

	constructor (rows, cols, mines) {
		this.rows = rows;
		this.cols = cols;
		this.mines = mines;
		this.board = this.createBoard();
		this.boardContainer = document.querySelector("#minesweeper");
		this.gameOver = false;
		this.win = false;
	}

	createBoard () {
		return Array(this.rows).fill().map(()=>Array(this.cols).fill(0));
	}

	placeMines () {
		let minesPlaced = 0;
		while (minesPlaced < this.mines) {
			const row = Math.floor(Math.random() * this.rows);
			const col = Math.floor(Math.random() * this.cols);
			if (this.board[row][col] !== Minesweeper.BOMB_MASK) {
				this.board[row][col] = Minesweeper.BOMB_MASK;
				minesPlaced++;
			}
		}
	}

	countAdjecentMines () {
		let y = 0;
		this.board.forEach((row) => {
			let x = 0;
			row.forEach((cell) => {
				let count = 0;
				if (y > 0 && x > 0 && this.board[y-1][x-1] == Minesweeper.BOMB_MASK)
					count++;
				if (y > 0 && this.board[y-1][x] == Minesweeper.BOMB_MASK)
					count++;
				if (y > 0 && x < this.cols && this.board[y-1][x+1] == Minesweeper.BOMB_MASK)
					count++;
				if (x > 0 && this.board[y][x-1] == Minesweeper.BOMB_MASK)
					count++;
				if (x < this.cols && this.board[y][x+1] == Minesweeper.BOMB_MASK)
					count++;
				if (y < this.rows-1 && x > 0 && this.board[y+1][x-1] == Minesweeper.BOMB_MASK)
					count++;
				if (y < this.rows-1 && this.board[y+1][x] == Minesweeper.BOMB_MASK)
					count++;
				if (y < this.rows-1 && x < this.cols && this.board[y+1][x+1] == Minesweeper.BOMB_MASK)
					count++;
				if (cell != Minesweeper.BOMB_MASK)
					this.board[y][x] = count;
				x++;
			});
			y++;
		});
	}

	isBomb (x, y) {
		if ((this.board[y][x] & Minesweeper.BOMB_MASK) == Minesweeper.BOMB_MASK)
			return (true);
		return (false);
	}

	getCellValue (x, y) {
		return ((this.board[y][x]) & Minesweeper.NUMBER_MASK)
	}

	setCellRevealed (x, y) {
		this.board[y][x] = this.board[y][x] | Minesweeper.REVEALED_MASK;
	}

	isCellRevealed (x, y) {
		const cell = this.board[y][x];
		return ((cell & Minesweeper.REVEALED_MASK) == Minesweeper.REVEALED_MASK);
	}

	setCellFlagged (x, y) {
		this.board[y][x] = this.board[y][x] | Minesweeper.FLAG_MASK;
	}

	setCellUnflagged (x, y) {
		this.board[y][x] = this.board[y][x] ^ Minesweeper.FLAG_MASK;
	}

	isCellFlagged (x, y) {
		const cell = this.board[y][x];
		return ((cell & Minesweeper.FLAG_MASK) == Minesweeper.FLAG_MASK);
	}

	toggleFlag (x, y) {
		if (this.isCellFlagged(x, y))
			this.setCellUnflagged(x, y);
		else if (!this.isCellRevealed(x, y))
			this.setCellFlagged(x, y);
	}

	checkWin () {
		const allCells = this.rows * this.cols;
		const safeCells = allCells - this.mines;
		let revealedCells = 0;

		let y = 0;
		this.board.forEach((row) => {
			let x = 0;
			row.forEach((cell) => {
				if (this.isCellRevealed(x, y))
					revealedCells++;
				x++;
			});
			y++;
		});

		if (revealedCells == safeCells)
			return (true);
		return (false);
	}

	renderBoard () {
		this.boardContainer.innerHTML = "";
		let y = 0;
		this.board.forEach((row) => {
			const rowElement = document.createElement("div");
			rowElement.className = "row";
			let x = 0;
			row.forEach((cell) => {
				const cellElement = document.createElement("div");
				cellElement.classList.add("cell");
				cellElement.dataset.x = x;
				cellElement.dataset.y = y;
				if (this.isCellFlagged(x, y))
				{
					cellElement.classList.add("flag");
					cellElement.innerHTML = Minesweeper.FLAG_SVG;
					if (this.gameOver && !this.isBomb(x, y))
						cellElement.innerHTML = Minesweeper.WRONG_SVG;
				}	
				if (this.isCellRevealed(x, y))
				{
					cellElement.classList.add("revealed");
					cellElement.textContent = this.getCellValue(x, y) || "";
				}
				if (this.gameOver && this.isBomb(x, y))
				{
					cellElement.classList.add("bomb");
					cellElement.innerHTML = Minesweeper.BOMB_SVG;
				}
				rowElement.appendChild(cellElement);
				x++;
			});
			this.boardContainer.appendChild(rowElement);
			y++;
		});
	}

	floodFill (x, y) {
		const cell = this.board[y][x];
		if (this.isCellRevealed(x, y))
			return ;
		if (cell == Minesweeper.BOMB_MASK) {
			this.gameOver = true;
			window.alert("GAME OVER - YOU LOSE");
			return ;
		}
		if (this.getCellValue(x, y) > 0 && this.getCellValue(x, y) <= 8) {
			this.setCellRevealed(x, y);
			return ;
		}
		if (this.getCellValue(x, y) == 0)
			this.setCellRevealed(x, y);
		if (y-1 >= 0 && x-1 >= 0)
			this.floodFill(x-1, y-1);
		if (y-1 >= 0)
			this.floodFill(x, y-1);
		if (y-1 >= 0 && x+1 < this.cols)
			this.floodFill(x+1, y-1);
		if (x-1 >= 0)
			this.floodFill(x-1, y);
		if (x+1 < this.cols)
			this.floodFill(x+1, y);
		if (y+1 < this.rows && x-1 >= 0)
			this.floodFill(x-1, y+1);
		if (y+1 < this.rows)
			this.floodFill(x, y+1);
		if (y+1 < this.rows && x+1 < this.cols)
			this.floodFill(x+1, y+1);
		return ;
	}

	startGame () {
		this.placeMines();
		this.countAdjecentMines();
		this.renderBoard();

		this.boardContainer.addEventListener("click", (event) => {
			if (event.target.classList.contains("cell")){
				const cell = event.target;
				if (!this.gameOver)
				{
					this.floodFill(parseInt(cell.dataset.x), parseInt(cell.dataset.y));
					this.renderBoard();
					
					if (this.checkWin())
					{
						this.win = true;
						this.gameOver = true;
						window.alert("YOU WIN!");
					}
				}
			}
		})

		this.boardContainer.addEventListener("contextmenu", (event) => {
			event.preventDefault();
			const cell = event.target.closest(".cell");
			if (cell){
				if (!this.gameOver)
				{
					this.toggleFlag(parseInt(cell.dataset.x), parseInt(cell.dataset.y));
					this.renderBoard();
				}
			}
		})
	}
}

const game = new Minesweeper(9, 9, 10);
game.startGame();

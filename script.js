class Minesweeper {
	static NUMBER_MASK = 0b1111;		// 00001111 = 15
	static BOMB_MASK = 0b10000;			// 00010000 = 16
	static REVEALED_MASK = 0b100000;	// 00100000 = 32
	static FLAG_MASK = 0b1000000;		// 01000000 = 64
	static BOMB_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-bomb"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.499 3.996a2.2 2.2 0 0 1 1.556 .645l3.302 3.301a2.2 2.2 0 0 1 0 3.113l-.567 .567l.043 .192a8.5 8.5 0 0 1 -3.732 8.83l-.23 .144a8.5 8.5 0 1 1 -2.687 -15.623l.192 .042l.567 -.566a2.2 2.2 0 0 1 1.362 -.636zm-4.499 5.004a4 4 0 0 0 -4 4a1 1 0 0 0 2 0a2 2 0 0 1 2 -2a1 1 0 0 0 0 -2z" /><path d="M21 2a1 1 0 0 1 .117 1.993l-.117 .007h-1c0 .83 -.302 1.629 -.846 2.25l-.154 .163l-1.293 1.293a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.293 -1.292c.232 -.232 .375 -.537 .407 -.86l.007 -.14a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" /></svg>`;
	static FLAG_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-flag"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5a1 1 0 0 1 .3 -.714a6 6 0 0 1 8.213 -.176l.351 .328a4 4 0 0 0 5.272 0l.249 -.227c.61 -.483 1.527 -.097 1.61 .676l.005 .113v9a1 1 0 0 1 -.3 .714a6 6 0 0 1 -8.213 .176l-.351 -.328a4 4 0 0 0 -5.136 -.114v6.552a1 1 0 0 1 -1.993 .117l-.007 -.117v-16z" /></svg>`;
	static WRONG_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`;
	static SMILE_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-mood-smile"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.8 10.946a1 1 0 0 0 -1.414 .014a2.5 2.5 0 0 1 -3.572 0a1 1 0 0 0 -1.428 1.4a4.5 4.5 0 0 0 6.428 0a1 1 0 0 0 -.014 -1.414zm-6.19 -5.286l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm6 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" /></svg>`;
	static HAPPY_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-mood-happy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 9.66h-6a1 1 0 0 0 -1 1v.05a3.975 3.975 0 0 0 3.777 3.97l.227 .005a4.026 4.026 0 0 0 3.99 -3.79l.006 -.206a1 1 0 0 0 -1 -1.029zm-5.99 -5l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm6 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" /></svg>`;
	static WRRR_SVG = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-mood-wrrr"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10a10 10 0 1 1 0 -20m3.707 12.293a1 1 0 0 0 -1.262 -.125l-.945 .63l-.945 -.63l-.116 -.066a1 1 0 0 0 -.994 .066l-.945 .63l-.945 -.63a1 1 0 0 0 -1.262 .125l-1 1a1 1 0 0 0 0 1.414l.094 .083a1 1 0 0 0 1.32 -.083l.42 -.42l.818 .545l.116 .066a1 1 0 0 0 .994 -.066l.945 -.63l.945 .63l.116 .066a1 1 0 0 0 .994 -.066l.817 -.545l.42 .42a1 1 0 0 0 1.415 -1.414zm-6.5 -6.5a1 1 0 0 0 -1.414 0l-.083 .094a1 1 0 0 0 .083 1.32l.792 .793l-.792 .793a1 1 0 0 0 1.414 1.414l1.5 -1.5a1 1 0 0 0 0 -1.414zm7 0a1 1 0 0 0 -1.414 0l-1.5 1.5a1 1 0 0 0 0 1.414l1.5 1.5a1 1 0 0 0 1.414 0l.083 -.094a1 1 0 0 0 -.083 -1.32l-.792 -.793l.792 -.793a1 1 0 0 0 0 -1.414" /></svg>`;

	constructor (rows, cols, mines) {
		this.rows = rows;
		this.cols = cols;
		this.mines = mines;
		this.flagsPlaced = 0;
		this.board = this.createBoard();
		this.boardContainer = document.querySelector("#board");
		this.mineCount = document.querySelector("#mine-count span");
		this.timer = document.querySelector("#timer span");
		this.gameFace = document.querySelector("#game-status .face");
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
		{
			this.flagsPlaced--;
			this.setCellUnflagged(x, y);
		}
		else if (!this.isCellRevealed(x, y))
		{
			this.flagsPlaced++;
			this.setCellFlagged(x, y);
		}
		this.updateMineCount();
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

	updateMineCount () {
		this.mineCount.textContent = this.mines-this.flagsPlaced;
	}

	floodFill (x, y) {
		const cell = this.board[y][x];
		if (this.isCellRevealed(x, y))
			return ;
		if (cell == Minesweeper.BOMB_MASK) {
			this.gameOver = true;
			this.gameFace.innerHTML = Minesweeper.WRRR_SVG;
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
		this.updateMineCount();
		this.gameFace.innerHTML = Minesweeper.SMILE_SVG;

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
						this.gameFace.innerHTML = Minesweeper.HAPPY_SVG;
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

		let seconds = 0;
		const timer = setInterval(() => {
			if (!this.gameOver)
			{
				seconds++;
				this.timer.textContent = seconds;
			}
			else
				clearInterval(timer);
		}, 1000);
	}
}

const game = new Minesweeper(9, 9, 10);
game.startGame();

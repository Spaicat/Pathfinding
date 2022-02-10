class Grid {
	constructor(wrapper, cellSize = 40) {
		this.width = 0;
		this.height = 0;
		this.grid = null;
		this.array = null;
		this.wrapper = wrapper;
		this.cellSize = cellSize;

		this.init();
		window.addEventListener("resize", () => this.handleResize());
		this.handleResize();
	}

	init() {
		this.drawGrid();
		console.log("New grid created");
	}

	drawGrid() {
		this.gridLayout = document.createElement("div");
		this.gridLayout.className = "layout";
		this.wrapper.appendChild(this.gridLayout);

		this.grid = document.createElement("table");
		this.grid.className = "grid";
		this.gridLayout.appendChild(this.grid);

		this.array = Array(this.height);

		let gridFragment = document.createDocumentFragment();
		for (let i = 0; i < this.height; i++) {
			this.array[i] = Array(this.width);

			let row = document.createElement("tr");
			for (let j = 0; j < this.width; j++) {
				let cell = document.createElement("td");
				cell.style.minWidth = this.cellSize + "px";
				cell.style.minHeight = this.cellSize + "px";
				cell.style.width = this.cellSize + "px";
				cell.style.height = this.cellSize + "px";
				row.appendChild(cell);

				this.array[i][j] = cell;
			}
			gridFragment.appendChild(row);
		}
		this.grid.appendChild(gridFragment);
	}

	handleResize() {
		let width = Math.floor((this.gridLayout.clientWidth) / this.cellSize);
		let height = Math.floor((this.gridLayout.clientHeight) / this.cellSize);
		if (height != this.height || width != this.width) {
			this.width = width;
			this.height = height;
			this.gridLayout.remove();
			this.init();
		}
	}
}
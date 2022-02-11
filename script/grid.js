class Grid {
	constructor(wrapper, cellSize = 40) {
		this.width = 0;
		this.height = 0;
		this.grid = null;
		this.array = null;
		this.wrapper = wrapper;
		this.cellSize = cellSize;

		this.isMouseDown = false;
		this.cellSelected = null;
		this.typeSelected = false;

		this.build();
		window.addEventListener("resize", () => this.handleResize());
		this.handleResize();
	}

	build() {
		this.drawGrid();
		this.addEvent();
		console.log("New grid created");
	}

	addEvent() {
		this.grid.addEventListener("mousedown", (event) => {
			event.preventDefault();
			this.isMouseDown = true;


			if (event.target.classList.contains("start")) {
				this.typeSelected = "start";
			}
			else if (event.target.classList.contains("end")) {
				this.typeSelected = "end";
			}
			else {
				this.typeSelected = "wall";
				this.cellSelected = this.getCellCoord(event);
				this.putWall(this.cellSelected);
			}
		});
		const removeSelection = (event) => {
			event.preventDefault();
			this.isMouseDown = false;
			this.cellSelected = null;
		}
		this.grid.addEventListener("mouseup", removeSelection);
		this.grid.addEventListener("mouseleave", removeSelection);
		this.grid.addEventListener("mousemove", (event) => {
			event.preventDefault();
		
			if (this.isMouseDown && event.target.nodeName == "TD") {
				let cellSelected = this.getCellCoord(event);
				if (!Coord.isEqual(this.cellSelected, cellSelected)
					&& this.inRange(cellSelected)) {
					this.cellSelected = cellSelected;
					if (this.typeSelected == "start" && !event.target.classList.contains("end")) {
						this.putStart(this.cellSelected);
					}
					else if (this.typeSelected == "end" && !event.target.classList.contains("start")) {
						this.putEnd(this.cellSelected);
					}
					else if (this.typeSelected == "wall") {
						this.putWall(this.cellSelected);
					}
				}
			}
		});
	}

	getCellCoord(event) {
		return new Coord(
			Math.floor((event.clientY - this.grid.offsetTop) / this.cellSize),
			Math.floor((event.clientX - this.grid.offsetLeft) / this.cellSize)
		);
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
			this.build();
			
			let startCell = new Coord(
				Math.floor(height / 2),
				Math.floor(width / 4)
			);
			this.putStart(startCell);
			let endCell = new Coord(
				Math.floor(height / 2),
				Math.floor(width / 1.25)
			);
			this.putEnd(endCell);
		}
	}

	inRange(coord) {
		return coord.x >= 0 && coord.x < this.height
			&& coord.y >= 0 && coord.y < this.width;
	}

	putUniqueClass(coord, className) {
		let cell = this.grid.querySelector("." + className);
		if (cell !== null)
			cell.classList.remove(className);
		this.array[coord.x][coord.y].className = className;
	}
	putStart(coord) {
		this.putUniqueClass(coord, "start");
	}
	putEnd(coord) {
		this.putUniqueClass(coord, "end");
	}
	putWall(coord) {
		let cell = this.array[coord.x][coord.y];
		if (cell.classList.contains("wall"))
			cell.classList.remove("wall");
		else
			cell.classList.add("wall");
	}
}
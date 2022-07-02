class Grid {
	constructor(wrapper, width, height, cellSize = 40, algo = AStar, maze = Kruskal) {
		this.width = width;
		this.height = height;
		this.grid = null;
		this.array = null;
		this.wrapper = wrapper;
		this.cellSize = cellSize;

		this.isMouseDown = false;
		this.cellSelected = null;
		this.typeSelected = false;

		this.drawGrid();
		this.addEvent();

		this.start = new Coord(1, 1);
		this.end = new Coord(this.height - 2, this.width - 2);
		this.putStart(this.start);
		this.putEnd(this.end);

		this.algo = algo;
		this.maze = maze;
	}

	addEvent() {
		const removeSelection = (event) => {
			event.preventDefault();
			this.isMouseDown = false;
			this.cellSelected = null;
		}
		this.grid.addEventListener("mouseup", removeSelection);
		this.grid.addEventListener("mouseleave", removeSelection);
		this.grid.addEventListener("mousedown", (event) => {
			event.preventDefault();
			this.isMouseDown = true;


			if (event.target.classList.contains("start")) {
				this.typeSelected = "start";
			}
			else if (event.target.classList.contains("end")) {
				this.typeSelected = "end";
			}
			else if (event.target.classList.contains("wall")) {
				this.typeSelected = "empty";
				this.cellSelected = this.getCellCoord(event);
				this.clearPath();
				this.removeWall(this.cellSelected);
			}
			else {
				this.typeSelected = "wall";
				this.cellSelected = this.getCellCoord(event);
				this.clearPath();
				this.putWall(this.cellSelected);
			}
			grid.findPath(this.algo);
		});
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
					else if (this.typeSelected == "empty") {
						this.removeWall(this.cellSelected);
					}
					grid.findPath(this.algo);
				}
			}
		});
	}

	getDOMCell(coord) {
		return this.array[coord.x][coord.y]
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

		console.log("New Grid Generated");
	}

	findPath(callback) {
		this.clearPath();
		this.algo = callback;
		let algo = new callback(this);
		algo.find();
	}

	generateMaze(callback) {
		this.clearPath();
		this.clearWall();
		this.maze = callback;
		let algo = new callback(this);
		algo.generate();
	}

	clearPath() {
		clearInterval(intervalSearch);
		this.array.forEach((line) => {
			line.forEach((cell) => {
				let currentCell = cell.classList;
				if (currentCell.contains("visited"))
					currentCell.remove("visited");
				else if (currentCell.contains("path"))
					currentCell.remove("path");
			});
		});
	}
	clearWall() {
		clearInterval(intervalMaze);
		this.array.forEach((line) => {
			line.forEach((cell) => {
				if (cell.classList.contains("wall"))
					cell.className = "";
			});
		});
	}

	inRange(coord) {
		return coord.x >= 0 && coord.x < this.height
			&& coord.y >= 0 && coord.y < this.width;
	}

	getNeighbors(coord) {
		this.test = false;
		let neighbors = [];

		//West, East, South, North
		let directions = [new Coord(-1, 0), new Coord(1, 0),
			new Coord(0, -1), new Coord(0, 1)];

		directions.forEach((dir) => {
			let current = new Coord(coord.x + dir.x, coord.y + dir.y);
			if (this.inRange(current)) {
				let cell = this.array[current.x][current.y];
				if (!cell.classList.contains("wall"))
					neighbors.push(current);
			}
		});

		return neighbors;
	}

	putClass(coord, className) {
		this.array[coord.x][coord.y].className = className;
	}
	putUniqueClass(coord, className) {
		this.clearPath();
		
		let cell = this.grid.querySelector("." + className);
		if (cell !== null)
			cell.classList.remove(className);
		this.putClass(coord, className);
	}
	putStart(coord) {
		this.putUniqueClass(coord, "start");
		this.start = coord;
	}
	putEnd(coord) {
		this.putUniqueClass(coord, "end");
		this.end = coord;
	}
	putWall(coord) {
		let cell = this.array[coord.x][coord.y];
		if (cell.className === "")
			this.putClass(coord, "wall");
	}
	removeWall(coord) {
		let cell = this.array[coord.x][coord.y];
		if (cell.classList.contains("wall"))
			cell.classList.remove("wall");
	}
	putVisited(coord) {
		let cell = this.array[coord.x][coord.y];
		if (cell.className === "")
			this.putClass(coord, "visited");
	}
	putPath(coord) {
		let cell = this.array[coord.x][coord.y];
		if (cell.className === "visited")
			this.putClass(coord, "path");
		else if (cell.className === "start" || cell.className === "end")
			cell.classList.add("path");
	}
}
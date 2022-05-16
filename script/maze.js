let intervalMaze = () => {};

class Maze {
	constructor(grid) {
		this.grid = grid;
		this.width = grid.width;
		this.height = grid.height;
		this.start = grid.start;
		this.end = grid.end;

		// Make dimensions odd
		/*width -= width % 2;
		width++;
		height -= height % 2;
		height++;*/
	}

	shuffle(array) {
		let newArray = array;
		// Durstendfeld shuffle
		for (let i = array.length-1; i > 0; i--) {
			const rand = Math.floor(Math.random() * i);
			[array[i], array[rand]] = [array[rand], array[i]];
		}
		return newArray;
	}
}

class Kruskal extends Maze {
	generate() {
		let cells = [];
		let edges = [];

		// Pick all edges (walls between each empty cell)
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				let cell = new Coord(i, j);
				this.grid.putWall(cell);

				if (i % 2 && j % 2) {
					cells.push(cell);
				}
				if (((i + j) % 2 == 1)
					&& (i >= 1 && j >= 1)
					&& (i < this.height-1 && j < this.width-1)) {
					if (i % 2 == 0)
						edges.push([cell, new Coord(i-1, j), new Coord(i+1, j)]);
					else
						edges.push([cell, new Coord(i, j-1), new Coord(i, j+1)]);
				}
			}
		}

		edges = this.shuffle(edges);

		let connected = [];
		let set = new UnionFind(cells, (a, b) => Coord.isEqual(a, b));
		while (edges.length > 0) {
			let edge = edges.shift();
			if (!Coord.isEqual(set.find(edge[1]).element, set.find(edge[2]).element)) {
				connected.push(edge);
				set.union(edge[1], edge[2]);
			}
		}

		intervalMaze = setInterval(() => {
			if (connected.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cells = connected.shift();
				this.grid.removeWall(cells[0]);
				this.grid.removeWall(cells[1]);
				this.grid.removeWall(cells[2]);
			}
		}, 10);
	}
}

class BinaryTree extends Maze {
	generate() {
		let cells = [];
		let edges = [];

		// Pick all edges (walls between each empty cell)
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				let cell = new Coord(i, j);
				this.grid.putWall(cell);

				if (i % 2 && j % 2) {
					cells.push(cell);
					if (i < this.height-2) {
						if (j < this.width-2)
							edges.push([cell, new Coord(i+1, j), new Coord(i, j+1)])
						else
							edges.push([cell, new Coord(i+1, j), new Coord(i+1, j)])
					}
					else
						edges.push([cell, new Coord(i, j+1), new Coord(i, j+1)])
				}
			}
		}

		let connected = [];
		for (let i = 0; i < cells.length-1; i++) {
			let rand = ~~(Math.random() * 2) + 1;
			let edge = edges[i][rand];
			connected.push([edges[i][0], edge]);
		}

		intervalMaze = setInterval(() => {
			if (connected.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cells = connected.shift();
				this.grid.removeWall(cells[0]);
				this.grid.removeWall(cells[1]);
			}
		}, 10);
	}
}

class Prim extends Maze {
	generate() {
		let maze = [];
		let cells = [];

		for (let i = 0; i < this.height; i++) {
			maze.push([]);
			for (let j = 0; j < this.width; j++) {
				let cell = new Coord(i, j);
				this.grid.putWall(cell);

				maze[i][j] = "wall";
				if (i % 2 && j % 2) {
					cells.push(cell);
				}
			}
		}

		// Pick a random cell
		let randomCell = cells[~~(Math.random() * cells.length)];
		maze[randomCell.x][randomCell.y] = "path";
		let visited = [randomCell];

		// Add walls of the cell to the wall list
		let walls = [];
		if (randomCell.x+1 < this.height-1)	walls.push(new Coord(randomCell.x+1, randomCell.y));
		if (randomCell.x-1 > 0)				walls.push(new Coord(randomCell.x-1, randomCell.y));
		if (randomCell.y+1 < this.width-1)	walls.push(new Coord(randomCell.x, randomCell.y+1));
		if (randomCell.y-1 > 0)				walls.push(new Coord(randomCell.x, randomCell.y-1));

		// While there are walls in list
		while (walls.length > 0) {
			// Pick a random wall from list
			let wallIndex = ~~(Math.random() * walls.length);
			let wall = walls[wallIndex];

			// If only one of the two cells that the wall divides is visited
			let uc = []; // Unvisited cells
			if(wall.x+1 < this.height-1	&& maze[wall.x+1][wall.y] === "path") uc.push(new Coord(wall.x-1, wall.y));
			if(wall.x-1 > 0				&& maze[wall.x-1][wall.y] === "path") uc.push(new Coord(wall.x+1, wall.y));
			if(wall.y+1 < this.width-1	&& maze[wall.x][wall.y+1] === "path") uc.push(new Coord(wall.x, wall.y-1));
			if(wall.y-1 > 0				&& maze[wall.x][wall.y-1] === "path") uc.push(new Coord(wall.x, wall.y+1));

			if (uc.length === 1) {
				// Make the wall a passage and mark the unvisited cell as part of the maze.
				maze[wall.x][wall.y] = "path";
				visited.push(wall);

				// Add the neighboring walls of the cell to the wall list.
				if (uc[0].x >=0 && uc[0].x <this.height && uc[0].y >=0 && uc[0].y<this.width) {
					maze[uc[0].x][uc[0].y] = "path";
					visited.push(uc[0]);

					if(uc[0].x+1 < this.height-1	&& maze[uc[0].x+1][uc[0].y] === "wall") walls.push(new Coord(uc[0].x+1, uc[0].y));
					if(uc[0].x-1 > 0				&& maze[uc[0].x-1][uc[0].y] === "wall") walls.push(new Coord(uc[0].x-1, uc[0].y));
					if(uc[0].y+1 < this.width-1		&& maze[uc[0].x][uc[0].y+1] === "wall") walls.push(new Coord(uc[0].x, uc[0].y+1));
					if(uc[0].y-1 > 0				&& maze[uc[0].x][uc[0].y-1] === "wall") walls.push(new Coord(uc[0].x, uc[0].y-1));
				}
			}

			// Remove wall from list
			walls.splice(wallIndex, 1);
		}

		intervalMaze = setInterval(() => {
			if (visited.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cell = visited.shift();
				this.grid.putWall(cell);
			}
		}, 10);
	}
}

class RecursiveBacktracker extends Maze {
	constructor(grid) {
		super(grid);
		this.maze = [];
	}

	inBound(coord) {
		return coord.x >= 0 && coord.x < this.height
			&& coord.y >= 0 && coord.y < this.width;
	}

	isWall(coord) {
		return this.inBound(coord) && this.maze[coord.x][coord.y] === "wall";
	}

	recursive(currentCoord) {
		let path = [currentCoord];
		this.maze[currentCoord.x][currentCoord.y] = "path";

		let directions = [new Coord(1, 0), new Coord(-1, 0), new Coord(0, 1), new Coord(0, -1)];
		directions = this.shuffle(directions);

		while (directions.length > 0) {
			let directionToTry = directions.pop();

			let node = new Coord(currentCoord.x + (directionToTry.x * 2), currentCoord.y + (directionToTry.y * 2));

			if (this.isWall(node)) {
				let linkCell = new Coord(currentCoord.x + directionToTry.x, currentCoord.y + directionToTry.y);
				this.maze[linkCell.x][linkCell.y] = "path";
                path.push(linkCell);

				path.push(...this.recursive(node));
			}
		}

		return path;
	}

	generate() {
		for (let i = 0; i < this.height; i++) {
			this.maze.push([])
			for (let j = 0; j < this.width; j++) {
				let cell = new Coord(i, j);
				this.grid.putWall(cell);
				this.maze[i][j] = "wall";
			}
		}

		// Pick a random starting cell but odd number -> To have a wall at each border
		let start = new Coord(
			~~(Math.random() * this.height/2)*2+1,
			~~(Math.random() * this.width/2)*2+1
		);
		let path = this.recursive(start);

		intervalMaze = setInterval(() => {
			if (path.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cells = path.shift();
				this.grid.removeWall(cells);
			}
		}, 10);
	}
}

class RecursiveDivision extends Maze {
	constructor(grid) {
		super(grid);
		this.maze = [];
	}

	divide(iCoords, jCoords, orientation) {
		let walls = [];
		let iDim = iCoords.y - iCoords.x;
		let jDim = jCoords.y - jCoords.x;

		if (iDim <= 0 || jDim <= 0) return [];

		if (orientation === "h") {
			let split;
			do {
				split = Math.floor(Math.random() * (iDim + 1)) + iCoords.x;
			} while (split % 2);

			let hole;
			do {
				hole = Math.floor(Math.random() * (jDim + 1)) + jCoords.x;
			} while (!(hole % 2));

			for (let j = jCoords.x; j <= jCoords.y; j++) {
				if (j !== hole) {
					this.maze[split][j] = 1;
					walls.push(new Coord(split, j));
				}
			}

			let first = this.divide(
				new Coord(iCoords.x, split - 1),
				jCoords,
				this.getOrientation(split - iCoords.x - 1, jDim)
			);
			let second = this.divide(
				new Coord(split + 1, iCoords.y),
				jCoords,
				this.getOrientation(iCoords.y - split - 1, jDim)
			);
			walls.push(...first);
			walls.push(...second);
		}
		else {
			let split;
			do {
				split = Math.floor(Math.random() * (jDim + 1)) + jCoords.x;
			} while (split % 2);

			let hole;
			do {
				hole = Math.floor(Math.random() * (iDim + 1)) + iCoords.x;
			} while (!(hole % 2));

			for (let i = iCoords.x; i <= iCoords.y; i++) {
				if (i !== hole) {
					this.maze[i][split] = 1;
					walls.push(new Coord(i, split));
				}
			}

			let first = this.divide(
				iCoords,
				new Coord(jCoords.x, split - 1),
				this.getOrientation(iDim, split - jCoords.x - 1)
			);
			let second = this.divide(
				iCoords,
				new Coord(split + 1, jCoords.y),
				this.getOrientation(jCoords.x - split - 1)
			);
			walls.push(...first);
			walls.push(...second);
		}

		return walls;
	}

	getOrientation(iDim, jDim) {
		if (iDim < jDim) return "v";
		else if (jDim < iDim) return "h";
		else return Math.floor(Math.random() * 2) ? "h" : "v";
	}

	generate() {
		let walls = [];

		for (let i = 0; i < this.height; i++) {
			this.maze.push([]);
			for (let j = 0; j < this.width; j++) {
				this.maze[i][j] = 0;
				if (i === 0 || j === 0 || i === this.height - 1 || j === this.width - 1) {
					this.maze[i][j] = 1;
					walls.push(new Coord(i, j));
				}
			}
		}

		let insideWalls = this.divide(
			new Coord(1, this.height - 2),
			new Coord(1, this.width - 2),
			this.getOrientation(1, 1)
		);
		walls.push(...insideWalls);

		intervalMaze = setInterval(() => {
			if (walls.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cell = walls.shift();
				this.grid.putWall(cell);
			}
		}, 10)
	}
}
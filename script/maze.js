let intervalMaze = () => {};

class Maze {
	constructor(grid) {
		this.grid = grid;
		this.width = grid.width;
		this.height = grid.height;
		this.start = grid.start;
		this.end = grid.end;
	}
}

class Kruskal extends Maze {
	shuffle(array) {
		let newArray = array;
		// Durstendfeld shuffle
		for (let i = array.length-1; i > 0; i--) {
			const rand = Math.floor(Math.random() * i);
			[array[i], array[rand]] = [array[rand], array[i]];
		}
		return newArray;
	}

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
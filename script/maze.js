let intervalMaze = () => {};

class Maze {
	constructor(grid) {
		this.grid = grid;
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
		for (let i = 0; i < this.grid.height; i++) {
			for (let j = 0; j < this.grid.width; j++) {
				let cell = new Coord(i, j);
				if (i % 2 && j % 2) {
					// let neighbors = this.grid.getAllNeighbors(cell);
					// edges.push([cell, neighbors]);
					cells.push(cell);
				}
				else {
					this.grid.putWall(cell);
				}
				if (((i + j) % 2 == 1)
					&& (i >= 1 && j >= 1)
					&& (i < this.grid.height-1 && j < this.grid.width-1)) {
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
				connected.push(edge[0]);
				set.union(edge[1], edge[2]);
			}
		}

		intervalMaze = setInterval(() => {
			if (connected.length === 0) {
				clearInterval(intervalMaze);
			}
			else {
				let cell = connected.shift();
				this.grid.putWall(cell);
			}
		}, 10);
	}
}
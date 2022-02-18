let intervalSearch = () => {};

class Algorithm {
	constructor(grid) {
		this.grid = grid;
		this.start = grid.start;
		this.end = grid.end;
	}

	coordToKey(coord) {
		return coord.x + "_" + coord.y;
	}

	draw(predOfCells, listVisited, found) {
		const drawPath = () => {
			let listPath = [];
			let currentPath = this.end;
			if (found) {
				while(!Coord.isEqual(currentPath, this.start)) {
					currentPath = predOfCells[this.coordToKey(currentPath)];
					listPath.unshift(currentPath);
				}
				intervalSearch = setInterval(() => {
					let cell = listPath.shift();
					this.grid.putPath(cell);
					if (listPath.length === 0)

						clearInterval(intervalSearch);
				}, 10);
			}
		}

		intervalSearch = setInterval(() => {
			let cell = listVisited.shift();
			this.grid.putVisited(cell);
			if (listVisited.length === 0) {
				clearInterval(intervalSearch);
				drawPath();
			}
		}, 1);
	}
}

class breadthFirstSearch extends Algorithm {
	find() {
		let queue = [];
		queue.push(this.start);

		let found = false;
		let listVisited = [];
		let predOfCells = {};
		predOfCells[this.coordToKey(this.start)] = this.start;

		while (queue.length > 0 && !found) {
			let current = queue.shift();

			if (Coord.isEqual(current, this.end))
				break;

			let neighbors = this.grid.getNeighbors(current);
			for (let i = 0; i < neighbors.length; i++) {
				let next = neighbors[i];
				if (!(this.coordToKey(next) in predOfCells)) {
					queue.push(next);
					predOfCells[this.coordToKey(next)] = current;
					listVisited.push(next);
					if (Coord.isEqual(next, this.end)) {
						found = true;
						break;
					}
				}
			}
		}

		this.draw(predOfCells, listVisited, found);
	}
}
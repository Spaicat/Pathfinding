let intervalSearch = () => {};

class ShortestPath {
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
			listPath.unshift(currentPath);
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
			if (listVisited.length === 0) {
				clearInterval(intervalSearch);
				drawPath();
			}
			else {
				let cell = listVisited.shift();
				this.grid.putVisited(cell);
			}
		}, 1);
	}
}

class BreadthFirst extends ShortestPath {
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

class AStar extends ShortestPath {
	heuristic(start, end) {
		//Manhattan distance
		return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
	}

	find() {
		let priorityQueue = new StablePriorityQueue((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
		priorityQueue.push([0, this.start]);

		let found = false;
		let listVisited = [];
		let predOfCells = {};
		let costOfCells = {};

		//First element
		predOfCells[this.coordToKey(this.start)] = this.start;
		costOfCells[this.coordToKey(this.start)] = 0;

		while (!priorityQueue.isEmpty() && !found) {
			let current = priorityQueue.pop()[1];

			if (Coord.isEqual(current, this.end))
				break;

			let neighbors = this.grid.getNeighbors(current);
			for (let i = 0; i < neighbors.length; i++) {
				let next = neighbors[i];
				let coordKey = this.coordToKey(next);
				let cost = costOfCells[this.coordToKey(current)] + 1;

				// Add to visited cells if not already done
				if (!listVisited.some(cellVisited => Coord.isEqual(cellVisited, next)))
					listVisited.push(next);

				if (!(coordKey in costOfCells) || cost < costOfCells[coordKey]) {
					predOfCells[coordKey] = current;
					costOfCells[coordKey] = cost;
					let priority = cost + this.heuristic(next, this.end);
					priorityQueue.push([priority, next]);
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

class GreedyBestFirst extends ShortestPath {
	heuristic(start, end) {
		//Manhattan distance
		return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
	}

	find() {
		let priorityQueue = new StablePriorityQueue((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
		priorityQueue.push([0, this.start]);

		let found = false;
		let listVisited = [];
		let predOfCells = {};
		let costOfCells = {};

		//First element
		predOfCells[this.coordToKey(this.start)] = this.start;
		costOfCells[this.coordToKey(this.start)] = 0;

		while (!priorityQueue.isEmpty() && !found) {
			let current = priorityQueue.pop()[1];

			if (Coord.isEqual(current, this.end))
				break;

			let neighbors = this.grid.getNeighbors(current);
			for (let i = 0; i < neighbors.length; i++) {
				let next = neighbors[i];
				let coordKey = this.coordToKey(next);
				let cost = costOfCells[this.coordToKey(current)] + 1;

				// Add to visited cells if not already done
				if (!listVisited.some(cellVisited => Coord.isEqual(cellVisited, next)))
					listVisited.push(next);
				
				if (!(coordKey in costOfCells) || cost < costOfCells[coordKey]) {
					predOfCells[coordKey] = current;
					costOfCells[coordKey] = cost;
					let priority = this.heuristic(next, this.end);
					priorityQueue.push([priority, next]);
					if (Coord.isEqual(next, this.end)) {
						listVisited.push(next);
						predOfCells[coordKey] = current;
						found = true;
						break;
					}
				}
			}
		}

		this.draw(predOfCells, listVisited, found);
	}
}
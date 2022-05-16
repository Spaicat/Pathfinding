let grid = null;
let currWidth = 4;
let currHeight = 4;
let width = 4;
let height = 4;
let cellSize = 30;
let pathFinderAlgo = null;
let mazeGeneratorAlgo = null;

window.onload = () => {
	let wrapper = document.querySelector(".wrapper");
	pathFinderAlgo = BreadthFirst;
	mazeGeneratorAlgo = Kruskal;
	grid = new Grid(wrapper, currWidth, currHeight, cellSize, pathFinderAlgo);

	const handleResize = () => {
		width = Math.floor((grid.gridLayout.clientWidth) / cellSize);
		height = Math.floor((grid.gridLayout.clientHeight) / cellSize);
		width -= (width+1) % 2;
		height -= (height+1) % 2;

		// Redo the grid only if the number of rows or columns have changed
		if (height != currHeight || width != currWidth) {
			grid.gridLayout.remove();
			grid = new Grid(wrapper, width, height, cellSize, pathFinderAlgo);
			currHeight = height;
			currWidth = width;
		}
	}
	window.addEventListener("resize", () => handleResize());
	handleResize();
}

search = () => {
	const pathFinderIndex = document.querySelector("#path").selectedIndex;

	switch (pathFinderIndex) {
		case 0:
			pathFinderAlgo = BreadthFirst;
			break;
		case 1:
			pathFinderAlgo = GreedyBestFirst;
			break;
		case 2:
			pathFinderAlgo = AStar;
			break;
	}

	grid.findPath(pathFinderAlgo);
}

build = () => {
	const mazeGeneratorIndex = document.querySelector("#maze").selectedIndex;

	switch (mazeGeneratorIndex) {
		case 0:
			mazeGeneratorAlgo = Kruskal;
			break;
		case 1:
			mazeGeneratorAlgo = Prim;
			break;
		case 2:
			mazeGeneratorAlgo = RecursiveBacktracker;
			break;
		case 3:
			mazeGeneratorAlgo = RecursiveDivision;
			break;
		case 4:
			mazeGeneratorAlgo = BinaryTree;
			break;
	}

	grid.generateMaze(mazeGeneratorAlgo);
}

clearAll = () => {
	grid.clearPath();
	grid.clearWall();
}
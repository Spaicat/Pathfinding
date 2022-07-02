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
	pathFinderAlgo = GreedyBestFirst;
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
	const pathFinderVal = document.querySelector("#path").value;

	switch (pathFinderVal) {
		case "BreadthFirst":
			pathFinderAlgo = BreadthFirst;
			break;
		case "GreedyBestFirst":
			pathFinderAlgo = GreedyBestFirst;
			break;
		case "AStar":
			pathFinderAlgo = AStar;
			break;
	}

	grid.findPath(pathFinderAlgo);
}

build = () => {
	const mazeGeneratorVal = document.querySelector("#maze").value;

	switch (mazeGeneratorVal) {
		case "Kruskal":
			mazeGeneratorAlgo = Kruskal;
			break;
		case "Prim":
			mazeGeneratorAlgo = Prim;
			break;
		case "RecursiveBacktracker":
			mazeGeneratorAlgo = RecursiveBacktracker;
			break;
		case "RecursiveDivision":
			mazeGeneratorAlgo = RecursiveDivision;
			break;
		case "BinaryTree":
			mazeGeneratorAlgo = BinaryTree;
			break;
	}

	grid.generateMaze(mazeGeneratorAlgo);
}

clearAll = () => {
	grid.clearPath();
	grid.clearWall();
}
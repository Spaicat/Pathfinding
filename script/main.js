let grid = null;
window.onload = () => {
	let wrapper = document.querySelector(".wrapper");
	let currWidth = 1;
	let currHeight = 1;
	let cellSize = 40;
	grid = new Grid(wrapper, currWidth, currHeight, cellSize);

	const handleResize = () => {
		let width = Math.floor((grid.gridLayout.clientWidth) / cellSize);
		let height = Math.floor((grid.gridLayout.clientHeight) / cellSize);
		if (height != currHeight || width != currWidth) {
			grid.gridLayout.remove();
			grid = new Grid(wrapper, width, height, cellSize);
			currHeight = height;
			currWidth = width;
		}
	}
	window.addEventListener("resize", () => handleResize());
	handleResize();

	grid.findPath(breadthFirstSearch);
}
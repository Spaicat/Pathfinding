let grid = null;
window.onload = () => {
	let wrapper = document.querySelector(".wrapper");
	let currWidth = 1;
	let currHeight = 1;
	let cellSize = 30;
	let algo = AStar;
	grid = new Grid(wrapper, currWidth, currHeight, cellSize, algo);

	const handleResize = () => {
		let width = Math.floor((grid.gridLayout.clientWidth) / cellSize);
		let height = Math.floor((grid.gridLayout.clientHeight) / cellSize);
		if (height != currHeight || width != currWidth) {
			grid.gridLayout.remove();
			grid = new Grid(wrapper, width, height, cellSize, algo);
			currHeight = height;
			currWidth = width;
		}
	}
	window.addEventListener("resize", () => handleResize());
	handleResize();
}
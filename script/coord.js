class Coord {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	//Deep equality
	static isEqual(coord1, coord2) {
		const isObject = (object) => {
			return object != null && typeof object === 'object';
		}

		if (!isObject(coord1) || !isObject(coord2)) {
			return false;
		}
		
		const keys1 = Object.keys(coord1);
		const keys2 = Object.keys(coord2);
		if (keys1.length !== keys2.length) {
			return false;
		}
		for (const key of keys1) {
			const val1 = coord1[key];
			const val2 = coord2[key];
			const areObjects = isObject(val1) && isObject(val2);
			if (
				areObjects && !isEqual(val1, val2) ||
				!areObjects && val1 !== val2
			) {
				return false;
			}
		}
		return true;
	}
}
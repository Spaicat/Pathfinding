class UnionFind {
	constructor(array, comparator = (a, b) => a === b) {
		// Size of disconnected elements
		this.size = array.length;
		this.set = [];
		this._comparator = comparator;

		array.forEach(elt => {
			this.makeSet(elt);
		});
	}

	makeSet(elt) {
		const node = {
			parent: null,
			element: elt
		};
		this.set.push(node);

		return node;
	}

	find(elt) {
		let x = this.set.find(node => this._comparator(node.element, elt));
		if (x.parent === null)
			return x;
		return this.find(x.parent);
	}

	union(elt1, elt2) {
		let root1 = this.find(elt1);
		let root2 = this.find(elt2);

		if (!this._comparator(root1.element, root2.element))
			root1.parent = root2.element;
	}

	// print() {
	// 	let listSet = [];
	// 	let rootSelected = [];
	// 	this.set.forEach((elt) => {
	// 		let root = this.find(elt.element);

	// 		if (rootSelected.find((e) => e === root) === undefined) {
	// 			rootSelected.push(root);
	// 			let listSubSet = [];
	// 			for (let i = 0; i < this.set.length; i++) {
	// 				if (root === this.find(this.set[i].element)) {
	// 					listSubSet.push(this.set[i]);
	// 				}
	// 			}
	// 			console.log(root, ":", ...listSubSet);
	// 			listSet.push(listSubSet);
	// 		}
	// 	});
	// 	//console.log(listSet);
	// }
}
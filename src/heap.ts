import DateFile from "src/dateFile";

export default class DateMinHeap {
	heap: DateFile[];
	size: number;
	constructor(size: number) {
		this.heap = [];
		this.size = size;
	}

	// Helper Methods
	getLeftChildIndex(parentIndex: number) {
		return 2 * parentIndex + 1;
	}
	getRightChildIndex(parentIndex: number) {
		return 2 * parentIndex + 2;
	}
	getParentIndex(childIndex: number) {
		return Math.floor((childIndex - 1) / 2);
	}
	hasLeftChild(index: number) {
		return this.getLeftChildIndex(index) < this.heap.length;
	}
	hasRightChild(index: number) {
		return this.getRightChildIndex(index) < this.heap.length;
	}
	hasParent(index: number) {
		return this.getParentIndex(index) >= 0;
	}
	leftChild(index: number) {
		return this.heap[this.getLeftChildIndex(index)];
	}
	rightChild(index: number) {
		return this.heap[this.getRightChildIndex(index)];
	}
	parent(index: number) {
		return this.heap[this.getParentIndex(index)];
	}

	// Functions to create Min Heap

	swap(indexOne: number, indexTwo: number) {
		const temp = this.heap[indexOne];
		this.heap[indexOne] = this.heap[indexTwo];
		this.heap[indexTwo] = temp;
	}

	peek() {
		if (this.heap.length === 0) {
			return null;
		}
		return this.heap[0];
	}

	// Removing an element will remove the
	// top element with highest priority then
	// heapifyDown will be called 
	remove() {
		if (this.heap.length === 0) {
			return null;
		}
		const item = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.heapifyDown();
		return item;
	}

	add(item: DateFile) {

		if (this.heap.length < this.size) {
			this._add(item);
		} else if (item.date && this.peek() && this.heap[0].date) {
			if (item.date > this.heap[0].date) {
				this.remove();
				this._add(item);
			}
		}
	}
	_add(item: DateFile) {
		this.heap.push(item);
		this.heapifyUp();
	}

	heapifyUp() {
		let index = this.heap.length - 1;
		while (this.hasParent(index) && this.parent(index).date && this.heap[index].date && this.parent(index).date > this.heap[index].date) {
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	heapifyDown() {
		let index = 0;
		while (this.hasLeftChild(index)) {
			let smallerChildIndex = this.getLeftChildIndex(index);
			if (this.hasRightChild(index) && this.rightChild(index).date < this.leftChild(index).date) {
				smallerChildIndex = this.getRightChildIndex(index);
			}
			if (this.heap[index].date < this.heap[smallerChildIndex].date) {
				break;
			} else {
				this.swap(index, smallerChildIndex);
			}
			index = smallerChildIndex;
		}
	}

	printHeap() {
		var heap = ` ${this.heap[0]} `
		for (var i = 1; i < this.heap.length; i++) {
			heap += ` ${this.heap[i].file.basename} `;
		}
	}
}

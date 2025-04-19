import DateFile from "src/dateFile";

/**
 * Min-heap data structure for DateFile objects, keeping only the most recent N items by date.
 * Used to efficiently track the top N most recent files for each time interval in the plugin.
 */
export default class DateMinHeap {
	/** The heap array storing DateFile objects. */
	heap: DateFile[];
	/** The maximum number of items the heap will retain. */
	size: number;

	/**
	 * Initialize a new DateMinHeap.
	 * @param size Maximum number of items to keep in the heap.
	 */
	constructor(size: number) {
		this.heap = [];
		this.size = size;
	}

	/**
	 * Get the index of the left child of a given parent index.
	 * @param parentIndex Index of the parent node.
	 * @returns Index of the left child node.
	 */
	getLeftChildIndex(parentIndex: number): number {
		return 2 * parentIndex + 1;
	}
	/**
	 * Get the index of the right child of a given parent index.
	 * @param parentIndex Index of the parent node.
	 * @returns Index of the right child node.
	 */
	getRightChildIndex(parentIndex: number): number {
		return 2 * parentIndex + 2;
	}

	/**
	 * Get the index of the parent of a given child index.
	 * @param childIndex Index of the child node.
	 * @returns Index of the parent node.
	 */
	getParentIndex(childIndex: number): number {
		return Math.floor((childIndex - 1) / 2);
	}

	/**
	 * Check if a node at a given index has a left child.
	 * @param index Index to check.
	 * @returns True if the node has a left child.
	 */
	hasLeftChild(index: number): boolean {
		return this.getLeftChildIndex(index) < this.heap.length;
	}

	/**
	 * Check if a node at a given index has a right child.
	 * @param index Index to check.
	 * @returns True if the node has a right child.
	 */
	hasRightChild(index: number): boolean {
		return this.getRightChildIndex(index) < this.heap.length;
	}

	/**
	 * Check if a node at a given index has a parent.
	 * @param index Index to check.
	 * @returns True if the node has a parent.
	 */
	hasParent(index: number): boolean {
		return this.getParentIndex(index) >= 0;
	}

	/**
	 * Get the left child DateFile of a node at a given index.
	 * @param index Index of the parent node.
	 * @returns The left child DateFile.
	 */
	leftChild(index: number): DateFile {
		return this.heap[this.getLeftChildIndex(index)];
	}

	/**
	 * Get the right child DateFile of a node at a given index.
	 * @param index Index of the parent node.
	 * @returns The right child DateFile.
	 */
	rightChild(index: number): DateFile {
		return this.heap[this.getRightChildIndex(index)];
	}

	/**
	 * Get the parent DateFile of a node at a given index.
	 * @param index Index of the child node.
	 * @returns The parent DateFile.
	 */
	parent(index: number): DateFile {
		return this.heap[this.getParentIndex(index)];
	}

	// Functions to create Min Heap

	/**
	 * Swap two nodes in the heap by their indices.
	 * @param indexOne Index of the first node.
	 * @param indexTwo Index of the second node.
	 */
	swap(indexOne: number, indexTwo: number): void {
		const temp = this.heap[indexOne];
		this.heap[indexOne] = this.heap[indexTwo];
		this.heap[indexTwo] = temp;
	}

	/**
	 * Get the top (oldest) DateFile in the heap without removing it.
	 * @returns The top DateFile, or null if the heap is empty.
	 */
	peek(): DateFile | null {
		if (this.heap.length === 0) {
			return null;
		}
		return this.heap[0];
	}

	/**
	 * Remove and return the top (oldest) DateFile from the heap.
	 * @returns The removed DateFile, or null if the heap is empty.
	 */
	remove(): DateFile | null {
		if (this.heap.length === 0) {
			return null;
		}
		const item = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.heapifyDown();
		return item;
	}

	/**
	 * Add a DateFile to the heap, keeping only the most recent N by date.
	 * If the heap is full and the new item is more recent than the oldest, it replaces the oldest.
	 * @param item The DateFile to add.
	 */
	add(item: DateFile): void {
		if (this.heap.length < this.size) {
			this._add(item);
		} else if (item.date && this.peek() && this.heap[0].date) {
			if (item.date > this.heap[0].date) {
				this.remove();
				this._add(item);
			}
		}
	}

	/**
	 * Internal helper to add an item and restore heap property upwards.
	 * @param item The DateFile to add.
	 */
	_add(item: DateFile): void {
		this.heap.push(item);
		this.heapifyUp();
	}

	/**
	 * Restore the heap property upwards from the last element.
	 */
	heapifyUp(): void {
		let index = this.heap.length - 1;
		while (this.hasParent(index) && this.parent(index).date && this.heap[index].date && this.parent(index).date > this.heap[index].date) {
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	/**
	 * Restore the heap property downwards from the root element.
	 */
	heapifyDown(): void {
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

	/**
	 * Return a string representation of the heap for debugging.
	 * @returns A string listing the basenames of files in the heap.
	 */
	printHeap(): string {
		let heap = ` ${this.heap[0]} `;
		for (let i = 1; i < this.heap.length; i++) {
			heap += ` ${this.heap[i].file.basename} `;
		}
		return heap;
	}
}


DateMinHeap.prototype.toString = function () {
	return this.heap.toString();
}

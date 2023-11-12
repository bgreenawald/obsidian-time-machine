import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	Workspace,
} from "obsidian";

import {DEFAULT_SETTINGS, TimeMachineSettings, TimeMAchineSettingTab} from "settings";

// Remember to rename these classes and interfaces!

class TimeInterval {
	headerName: string;
	dateBoundary: Date;
	minHeap: DateMinHeap;

	constructor(headerName: string, dateBoundary: Date, minHeap: DateMinHeap) {
		this.headerName = headerName;
		this.dateBoundary = dateBoundary;
		this.minHeap = minHeap;
	}
}

var timeIntervals: TimeInterval[];

function updateTimeIntervals(settings: TimeMachineSettings) {
	timeIntervals = [];

	if (settings.timeIntervalWeek) {
		var prevWeek = new Date();
		prevWeek.setDate(prevWeek.getDate() - 7);
		timeIntervals.push(new TimeInterval("A Week Ago", prevWeek, new DateMinHeap(settings.numberOfFiles)))
	}
	if (settings.timeIntervalTwoWeeks) {
		var prevTwoWeeks = new Date();
		prevTwoWeeks.setDate(prevTwoWeeks.getDate() - 14);
		timeIntervals.push(new TimeInterval("Two Weeks Ago", prevTwoWeeks, new DateMinHeap(settings.numberOfFiles)))
	}
	if (settings.timeIntervalMonth) {
		var prevMonth = new Date();
		prevMonth.setMonth(prevMonth.getMonth() - 1);
		timeIntervals.push(new TimeInterval("A Month Ago", prevMonth, new DateMinHeap(settings.numberOfFiles)))
	}
	if (settings.timeIntervalSixMonths) {
		var prevSixMonth = new Date();
		prevSixMonth.setMonth(prevSixMonth.getMonth() - 6);
		timeIntervals.push(new TimeInterval("Six Months Ago", prevSixMonth, new DateMinHeap(settings.numberOfFiles)));
	}
	if (settings.timeIntervalYear) {
		var previousYear = new Date();
		previousYear.setFullYear(previousYear.getFullYear() - 1);
		timeIntervals.push(new TimeInterval("A Year Ago", previousYear, new DateMinHeap(settings.numberOfFiles)));
	}
	if (settings.timeIntervalTwoYears) {
		var previousTwoYears = new Date();
		previousTwoYears.setFullYear(previousTwoYears.getFullYear() - 2);
		timeIntervals.push(new TimeInterval("Two Years Ago", previousTwoYears, new DateMinHeap(settings.numberOfFiles)));
	}
	if (settings.timeIntervalFiveYears) {
		var previousFiveYears = new Date();
		previousFiveYears.setFullYear(previousFiveYears.getFullYear() - 5);
		timeIntervals.push(new TimeInterval("5 Years Ago", previousFiveYears, new DateMinHeap(settings.numberOfFiles)));
	}
	if (settings.timeIntervalTenYears) {
		var previousTenYears = new Date();
		previousTenYears.setFullYear(previousTenYears.getFullYear() - 10);
		timeIntervals.push(new TimeInterval("10 Years Ago", previousTenYears, new DateMinHeap(settings.numberOfFiles)));
	}
}

function doesPathContainSubpath(path: string, subpath: string) {
    // Normalize paths by replacing backslashes with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const normalizedSubpath = subpath.replace(/\\/g, '/');

    // Ensure both paths end with a forward slash
    const pathWithTrailingSlash = normalizedPath.endsWith('/') ? normalizedPath : normalizedPath + '/';
    const subpathWithTrailingSlash = normalizedSubpath.endsWith('/') ? normalizedSubpath : normalizedSubpath + '/';

    // Check if the normalized path contains the normalized subpath
    return pathWithTrailingSlash.includes(subpathWithTrailingSlash);
}

export default class TimeMachine extends Plugin {
	settings: TimeMachineSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "run-time-machine",
			name: "Run Time Machine",
			callback: () => {
				new TimeMachineModal(this.app, this.settings).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TimeMAchineSettingTab(this.app, this));

	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		updateTimeIntervals(this.settings);
	}
}

class DateFile {
	file: TFile;
	content: Promise<string> | undefined;
	date: Date | undefined;

	constructor(file: TFile, content?: Promise<string>, date?: Date) {
		this.file = file;
		this.content = content;
		this.date = date;
	}

	setDate(date: Date) {
		this.date = date
	}

	setContent(content: Promise<string>) {
		this.content = content;
	}

}

class TimeMachineModal extends Modal {
	settings: TimeMachineSettings
	constructor(app: App, settings: TimeMachineSettings) {
		super(app);
		this.settings = settings;
	}

	private readonly focusFile = (file: TFile, shouldSplit = false): void => {
		if (file) {
			let leaf = this.app.workspace.getMostRecentLeaf();

			if (shouldSplit) {
				leaf = this.app.workspace.getLeaf("split");
			}
			leaf.openFile(file);
		}
		this.close();
	};

	async onOpen() {
		updateTimeIntervals(this.settings);
		// Reload the time machine files
		this.timeMachineFiles().then(() => {

			const openFile = this.app.workspace.getActiveFile();

			const rootEl = createDiv({ cls: "nav-folder mod-root" });
			const childrenEl = rootEl.createDiv({ cls: "nav-folder-children" });
			timeIntervals.forEach((timeInterval) => {
				childrenEl.createEl("h2", { text: timeInterval.headerName })
				timeInterval.minHeap.heap.forEach((file) => {
					const currentFile = file.file;
					const navFile = childrenEl.createDiv({
						cls: "tree-item nav-file recent-files-file",
					});
					const navFileTitle = navFile.createDiv({
						cls: "tree-item-self is-clickable nav-file-title recent-files-title",
					});
					const navFileTitleContent = navFileTitle.createDiv({
						cls: "tree-item-inner nav-file-title-content recent-files-title-content",
					});

					const title = navFileTitleContent.createEl("strong", {
						text: `${currentFile.basename}: ${file.date.toLocaleDateString('en-US')}`,
					});
					const path = navFileTitleContent.createEl("p", { text: currentFile.path });
					path.style["margin-block"] = '0.5em';

					navFileTitleContent.addEventListener("click", (event: MouseEvent) => {
						this.focusFile(currentFile, event.ctrlKey || event.metaKey);
					});
				})
			});

			const contentEl = this.containerEl.children[1];
			contentEl.empty();
			contentEl.appendChild(rootEl);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async timeMachineFiles() {
		const { vault } = this.app;

		const files: DateFile[] = await Promise.all(
			vault
				.getMarkdownFiles()
				.map((file) => new DateFile(file, vault.cachedRead(file)))
		);


		files.forEach((file) => {
			// Check if the path is in the ignore list
			if (this.settings.ignoreDirectories.some(ignorePath => doesPathContainSubpath(file.file.path, ignorePath))) {
				return;
			}

			if (file.content !== undefined) {
				file.content.then((content) => {
					const lines = content.split("\n");
					if (lines[0] != "---") {
						for (const line of lines) {
							if (line.includes(this.settings.propertyName)) {
								var curDateStr = line.split(":")[1].trim();
								var curDate = new Date(curDateStr);
								file.setDate(curDate);
								timeIntervals.forEach((timeInterval) => {
									if (curDate <= timeInterval.dateBoundary) {
										timeInterval.minHeap.add(file);
									}
								});
								break;
							}
						}
					}
				})
			}
		});
	}
};

class DateMinHeap {
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
		} else if (item.date > this.peek().date) {
			this.remove();
			this._add(item);
		}
	}
	_add(item: DateFile) {
		this.heap.push(item);
		this.heapifyUp();
	}

	heapifyUp() {
		let index = this.heap.length - 1;
		while (this.hasParent(index) && this.parent(index).date > this.heap[index].date) {
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

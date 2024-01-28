import {
	App,
	Modal,
	TFile,
} from "obsidian";

import { TimeMachineSettings } from "src/settings";
import DateFile from "./dateFile";

import { updateTimeIntervals, timeIntervals } from "./timeInterval"

export default class TimeMachineModal extends Modal {
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
			if (leaf) {
				leaf.openFile(file);
			}
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
				childrenEl.createEl("h2", { text: `${timeInterval.headerName} - ${timeInterval.dateBoundary.toLocaleDateString('en-US')}` })
				timeInterval.minHeap.heap.slice().reverse().forEach((file) => {
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
					if (file.date) {
						const p = navFileTitleContent.createEl("p")
						p.innerHTML = `<strong>${currentFile.basename}</strong>: <i><span class="date">${file.date.toLocaleDateString('en-US')}</span></i>`;
					}
					const path = navFileTitleContent.createEl("p", { text: currentFile.path });
					path.style.marginBlock = '0.5em';

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
					if (lines[0].trim() == "---") {
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

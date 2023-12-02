import {
	TFile,
} from "obsidian"

export default class DateFile {
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

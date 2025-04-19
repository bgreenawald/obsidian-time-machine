import {
	TFile,
} from "obsidian"

export default class DateFile {
	file: TFile;
	content: Promise<string> | undefined;
	date: Date;

	constructor(file: TFile, content?: Promise<string>, date?: Date) {
		this.file = file;
		this.content = content;

		// Initially, set the date to the earliest possible date to avoid null errors
		if (date == null){
			this.date = new Date(-8640000000000000);
		}
		else {
			this.date = date
		}
	}

	setDate(date: Date) {
		this.date = date
	}

	setContent(content: Promise<string>) {
		this.content = content;
	}

}

DateFile.prototype.toString = function () {
	return this.file.path;
}

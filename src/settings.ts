import { PluginSettingTab, Setting, App } from "obsidian";
import TimeMachine from "./main";


export interface TimeMachineSettings {
	propertyName: string,
	numberOfFiles: number,
	timeIntervalWeek: boolean,
	timeIntervalTwoWeeks: boolean,
	timeIntervalMonth: boolean,
	timeIntervalSixMonths: boolean,
	timeIntervalYear: boolean,
	timeIntervalTwoYears: boolean,
	timeIntervalFiveYears: boolean,
	timeIntervalTenYears: boolean,
	ignoreDirectories: string[];

}

export const DEFAULT_SETTINGS: TimeMachineSettings = {
	propertyName: "created-iso",
	numberOfFiles: 3,
	timeIntervalWeek: true,
	timeIntervalTwoWeeks: false,
	timeIntervalMonth: true,
	timeIntervalSixMonths: false,
	timeIntervalYear: true,
	timeIntervalTwoYears: false,
	timeIntervalFiveYears: true,
	timeIntervalTenYears: false,
	ignoreDirectories: []
};

export class TimeMachineSettingTab extends PluginSettingTab {
	plugin: TimeMachine;

	constructor(app: App, plugin: TimeMachine) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		let mainHeading = containerEl.createEl("h1");
		mainHeading.textContent = 'General Settings';

		new Setting(containerEl)
			.setName("Date Property")
			.setDesc("Enter the name of the date property to be used for comparing dates.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.propertyName)
					.onChange(async (value) => {
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignore Directories")
			.setDesc("Newline separated list of directories to ignore")
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.ignoreDirectories.join("\n"))
					.onChange(async (value) => {
						this.plugin.settings.ignoreDirectories = value
							.split(/\n+/)
							.map((v) => v.trim())
							.filter((v) => v);
						await this.plugin.saveSettings();
					}),
			);

		containerEl.createEl("hr");
		let timeRanges = containerEl.createEl("h1");
		timeRanges.textContent = 'Time Ranges';

		let timeRangeDesc = containerEl.createEl('p');
		timeRangeDesc.textContent = 'Set what time ranges you would like the time machine to use.'

		let weeks = containerEl.createEl("h3");
		weeks.textContent = 'Weeks';

		new Setting(containerEl)
			.setName("1 Week Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalWeek)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalWeek = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("2 Weeks Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalTwoWeeks)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalTwoWeeks = value;
						await this.plugin.saveSettings();
					}),
			);

		let months = containerEl.createEl("h3");
		months.textContent = 'Months';
		new Setting(containerEl)
			.setName("1 Month Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalMonth)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalMonth = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("6 Months Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalSixMonths)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalSixMonths = value;
						await this.plugin.saveSettings();
					}),
			);

		let years = containerEl.createEl("h3");
		years.textContent = 'Years';

		new Setting(containerEl)
			.setName("1 Year Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalYear)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalYear = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("2 Years Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalTwoYears)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalTwoYears = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("5 Years Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalFiveYears)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalFiveYears = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("10 Years Ago")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.timeIntervalTenYears)
					.onChange(async (value) => {
						this.plugin.settings.timeIntervalTenYears = value;
						await this.plugin.saveSettings();
					}),
			);


	}
}

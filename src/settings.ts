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

		const mainHeading = containerEl.createEl("h1");
		mainHeading.textContent = 'General Settings';

		new Setting(containerEl)
			.setName("Date Property")
			.setDesc("Enter the name of the date property to be used for comparing dates.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.propertyName)
					.onChange(async (_) => {
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
		const timeRanges = containerEl.createEl("h1");
		timeRanges.textContent = 'Time Ranges';

		const timeRangeDesc = containerEl.createEl('p');
		timeRangeDesc.textContent = 'Set what time ranges you would like the time machine to use.'

        // Define a union type for all the interval keys
        type IntervalKey =
            | 'timeIntervalWeek'
            | 'timeIntervalTwoWeeks'
            | 'timeIntervalMonth'
            | 'timeIntervalSixMonths'
            | 'timeIntervalYear'
            | 'timeIntervalTwoYears'
            | 'timeIntervalFiveYears'
            | 'timeIntervalTenYears';

        interface IntervalConfig {
            key: IntervalKey;
            name: string;
        }

        const timeIntervalGroups: { label: string; intervals: IntervalConfig[] }[] = [
            {
                label: 'Weeks',
                intervals: [
                    { key: 'timeIntervalWeek', name: '1 Week Ago' },
                    { key: 'timeIntervalTwoWeeks', name: '2 Weeks Ago' },
                ],
            },
            {
                label: 'Months',
                intervals: [
                    { key: 'timeIntervalMonth', name: '1 Month Ago' },
                    { key: 'timeIntervalSixMonths', name: '6 Months Ago' },
                ],
            },
            {
                label: 'Years',
                intervals: [
                    { key: 'timeIntervalYear', name: '1 Year Ago' },
                    { key: 'timeIntervalTwoYears', name: '2 Years Ago' },
                    { key: 'timeIntervalFiveYears', name: '5 Years Ago' },
                    { key: 'timeIntervalTenYears', name: '10 Years Ago' },
                ],
            },
        ];

        timeIntervalGroups.forEach(group => {
            const groupHeader = containerEl.createEl('h3');
            groupHeader.textContent = group.label;
            group.intervals.forEach(interval => {
                new Setting(containerEl)
                    .setName(interval.name)
                    .addToggle((toggle) =>
                        toggle
                            .setValue(this.plugin.settings[interval.key])
                            .onChange(async (value) => {
                                this.plugin.settings[interval.key] = value;
                                await this.plugin.saveSettings();
                            })
                    );
            });
        });


	}
}

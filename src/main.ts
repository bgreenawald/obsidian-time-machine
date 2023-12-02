import {
	Plugin,
} from "obsidian";

import TimeMachineModal from "src/modal";
import { updateTimeIntervals } from "./timeInterval";

import { DEFAULT_SETTINGS, TimeMachineSettings, TimeMAchineSettingTab } from "src/settings";


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






import DateMinHeap from "./heap";
import { TimeMachineSettings } from "./settings";

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

export var timeIntervals: TimeInterval[];

export function updateTimeIntervals(settings: TimeMachineSettings) {
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

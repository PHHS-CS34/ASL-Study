// use with if statement to do stuff only to the index.html
const isIndex = document.body.id === "homeBody";

const today = new Date();

function christmas() {
	const img = document.createElement("img");

	document.documentElement.style.setProperty('--color-darkText', '#3b0404');
	document.documentElement.style.setProperty('--color-background4', '#8a1c1c');

	img.src = "media/christmasLightsUpresRepeat.png";
	img.id = "christmasLights";

	document.body.appendChild(img);
}

// christmas();
// 1st Monday of december, 3rd friday of december to dec. 26
dateFunction(christmas, [
	dayOfWeekOfMonth(11, 1, 1),
	dateRange(
		dayOfWeekOfMonth(11, 5, 3),
		new Date(2026,11,26)
	)
]);

// Runs a function with a 1-in-chance probability.
// Example: rngFunction(myEasterEgg, 10) gives a 1-in-10 chance.
function rngFunction(iFunction, chance) {
	if (Math.random() < 1/chance) {
		iFunction();
	}
}

// Runs a function if today's date matches any provided date (month and day only; year is ignored).
// Accepts a single Date object, an array of Dates, or deeply nested arrays of Dates.
// Example: dateFunction(myEasterEgg, new Date("2026-10-28"))
// Example: dateFunction(myEasterEgg, [new Date("2026-10-28"), new Date("2026-12-25")])
function dateFunction(iFunction, iDates) {
	if (Array.isArray(iDates)){
		for (const date of iDates){
			dateFunction(iFunction, date);
		}
	}
	else {
		if (iDates.getMonth() === today.getMonth() && iDates.getDate() === today.getDate()) {
			iFunction();
		}
	}
}

// Calculates the Date for the Nth occurrence of a specific weekday in a given month.
// Parameters: month (0-11, where 0 = Jan), dayOfWeek (0-6, where 0 = Sun), occurrence (1 = 1st, 2 = 2nd, etc.).
// Example: dayOfWeekOfMonth(10, 4, 4) calculates the 4th Thursday of November (Thanksgiving).
function dayOfWeekOfMonth(month, dayOfWeek, occurrence) {
	const firstOfTheMonth = new Date(today.getFullYear(), month, 1);

	firstOfTheMonth.setDate(firstOfTheMonth.getDate()+trueMod(dayOfWeek-firstOfTheMonth.getDay(), 7));
	firstOfTheMonth.setDate(firstOfTheMonth.getDate() + 7*(occurrence-1));

	return firstOfTheMonth;
}

// Calculates the true mathematical modulo, ensuring a non-negative result for negative dividends.
// Parameters: n (dividend), m (divisor).
// Example: trueMod(-1, 7) returns 6.
function trueMod(n, m) {
	return ((n % m) + m) % m;
}

// Generates an array of Date objects spanning from startTime up to (including) endDate.
// Parameters: startTime (Date), endDate (Date).
// Example: dateRange(new Date(2026, 11, 20), new Date(2026, 11, 25))
function dateRange(startDate, endDate){
	const iDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	let dateList = [];
	while (iDate <= endDate){
		dateList.push(new Date(iDate));
		iDate.setDate(iDate.getDate()+1);
	}
	return dateList;
}

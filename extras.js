// use with if statement to do stuff only to the index.html
const isIndex = document.body.id === "homeBody";

const today = new Date();

// skew();
// April 1st, along with secret button
dateFunction(skew, new Date(2026, 3, 1));

// america();
// July 4, Memorial Day (Last Monday in May), Veterans Day (Nov 11), Presidents Day (3rd monday in february), Sep 11, Labor Day
const memorialDay = dayOfWeekOfMonth(5,1,1);
memorialDay.setDate(memorialDay.getDate()-7);
dateFunction(america, [
	new Date(2026,6,4),
	memorialDay,
	new Date(2026, 10, 11),
	dayOfWeekOfMonth(1, 1, 3),
	new Date(2026, 8, 11),
	dayOfWeekOfMonth(8,1,1)
]);

// christmas();
// Dec 1, 3rd friday of december to dec. 26
dateFunction(christmas, [
	new Date(2026, 11, 1),
	dateRange(
		dayOfWeekOfMonth(11, 5, 3),
		new Date(2026,11,26)
	)
]);

// occurs on load to either index or flashcards, page
if (Number(sessionStorage.getItem("skew")) >= 1){
	skew();
}

// increments the skew variable
function incrementSkew(){
	if (sessionStorage.getItem("skew")){
		sessionStorage.setItem("skew",Number(sessionStorage.getItem("skew"))+1);
	}
	else {
		sessionStorage.setItem("skew", 0);
	}

	if (Number(sessionStorage.getItem("skew")) === 1) skew();
}

function skew() {
	let allElements = document.querySelectorAll("body *");
	if (isIndex) allElements = document.querySelectorAll("main *");

	for (const el of allElements) {
		const randomValue = (Math.random()-0.5)*2*2;
		el.style.rotate = `${randomValue}deg`;
	}
}

function christmas() {
	const img = document.createElement("img");

	document.documentElement.style.setProperty('--color-darkText', '#3b0404');
	document.documentElement.style.setProperty('--color-background4', '#8a1c1c');

	img.src = "media/christmasLightsUpresRepeat.png";
	img.id = "christmasLights";

	document.body.appendChild(img);
}

function america() {
	document.documentElement.style.setProperty('--color-darkText', '#000000');
	document.documentElement.style.setProperty('--color-lightText', '#ede6e6');
	document.documentElement.style.setProperty('--color-background1', '#0A3161');
	document.documentElement.style.setProperty('--color-background2', '#0d76bd');
	document.documentElement.style.setProperty('--color-background3', '#B31942');
	document.documentElement.style.setProperty('--color-background4', '#0A3161');

	document.body.style.backgroundImage = "URL(media/STARS.svg)";
	document.body.style.backgroundRepeat = "repeat";
	document.body.style.backgroundSize = "10rem";
}

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

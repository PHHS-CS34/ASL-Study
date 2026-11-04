// use with if statement to do stuff only to the index.html
const isIndex = document.body.id === "homeBody";
const today = new Date();

rngFunction(myDudeBackground, 1);
function myDudeBackground(){
	let body = document.body;
	body.style.backgroundImage = "url(media/dudeTile.png)";
	body.style.backgroundRepeat = "repeat";
	body.style.backgroundSize = "200px";
	body.style.animation = "moveBackground 10s linear infinite";

	const tint = document.createElement("div");
	Object.assign(tint.style, {
		position: "fixed",
		inset: "0",
		backgroundColor: getComputedStyle(document.documentElement)
			.getPropertyValue("--color-background1").trim(),
		mixBlendMode: "color",
		opacity: "0.7",
		pointerEvents: "none",
		zIndex: "-1"
	});

	document.body.style.isolation = "isolate";
	document.body.prepend(tint);

	if (document.body.id === "homeBody"){
		document.getElementById("upToTwentyUnits").style.borderBottom = "0.4rem solid var(--color-background4)";
		let units17_24 = document.getElementById("upToThirtyUnits");
		units17_24.id = "upToTwentyUnits";

		let dudeUnitContainer = document.createElement("div");
		dudeUnitContainer.id = "upToThirtyUnits";
		dudeUnitContainer.className = "roundedLargeElement divButtons";

		let dudeButton = document.createElement("button");
		dudeButton.className = "unitButton buttons";
		dudeButton.title = "dude";
		dudeButton.id = "dudedude";
		dudeButton.style.width = "6rem";
		dudeButton.style.height = "6rem";
		dudeButton.dataset.uniton = "true";
        dudeButton.onclick = function() {decideColorOfButton("dudedude");};

		let imageTinter = document.createElement("div");
		imageTinter.id = "imageTinter";
		imageTinter.style.position = "relative";
		imageTinter.style.width = "100%";
		imageTinter.style.height = "100%";
		imageTinter.style.display = "flex";
		imageTinter.style.objectFit = "contain";
		imageTinter.style.alignItems = "center";

		let dudeButtonImg = document.createElement("img");
		dudeButtonImg.className = "unitText";
		dudeButtonImg.src = "media/dude.png";
		dudeButtonImg.style.maxWidth = "100%";
		dudeButtonImg.style.display = "block";

		const tint = document.createElement("div");
		tint.id = "tintColor";

		Object.assign(tint.style, {
			position: "absolute",
			inset: "0",
			backgroundColor: getComputedStyle(document.documentElement)
				.getPropertyValue("--color-background3").trim(),
			mixBlendMode: "color",
			opacity: "0.7",
			pointerEvents: "none",
			zIndex: "1"
		})

		imageTinter.appendChild(dudeButtonImg);
		imageTinter.appendChild(tint);

		dudeButton.appendChild(imageTinter);
		dudeUnitContainer.appendChild(dudeButton);

		units17_24.after(dudeUnitContainer);
	}

// <div id = "upToTenUnits" class="roundedLargeElement divButtons"></div>
// 	<div id = "upToTwentyUnits" class="roundedLargeElement divButtons"></div>
// 	<div id = "upToThirtyUnits" class="roundedLargeElement divButtons"></div>

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
function dateRange(startTime, endDate){
	const iDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
	let dateList = [];
	while (iDate <= endDate){
		dateList.push(new Date(iDate));
		iDate.setDate(iDate.getDate()+1);
	}
	return dateList;
}

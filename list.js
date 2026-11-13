let cardList = [];
let side = "asl";

void bootCards();

const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
	if (window.scrollY > 300) {
		scrollToTopBtn.classList.add("show");
	} else {
		scrollToTopBtn.classList.remove("show");
	}
});

scrollToTopBtn.addEventListener("click", () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
});


async function bootCards() {
	const response = await fetch("./cards.json");
	const data = await response.json();
	// The units query parameter is a comma-separated list; default to the "100" unit when absent.
	const units = (new URLSearchParams(window.location.search).get("units") ?? "2").split(",").map(Number);
	const listContainer = document.getElementById("listContainer");

	// Format the selected unit numbers as a readable heading, including the singular/plural and final "and".
	document.getElementById("listHeaderTitleDiv").innerHTML = "<h1>" + ((units.length > 1) ? "Units" : "Unit") + " " + units.slice(0, -1).join(", ") + ((units.length > 1) ? ", and " : "") + units.slice(-1) + " selected</h1>"

	// Each entry starts with its numeric unit ID, followed by that unit's card objects.
	for (let i = 1; i <= 24; i++) {
		if (units.includes(i)) {
			cardList.push([]);
			cardList[cardList.length - 1][0] = i;
			cardList[cardList.length - 1].push(...Object.values(data[`Unit${i}`]))
		}
	}

	let hr;

	for (let unit of cardList) {
		// Unit headings and section dividers are only needed when showing multiple units.
		if (cardList.length > 1) {
			let title = document.createElement("h1");
			title.textContent = "Unit " + unit[0];
			listContainer.appendChild(title);
			hr = document.createElement("hr");
			hr.className = "splitter";
			listContainer.appendChild(hr);
		}

		for (let card of unit) {
			let div = document.createElement("div");
			div.className = "termGifListPair";
			// The numeric unit ID is the first entry in each unit array, not a card to render.
			if (Number.isFinite(card)) continue;

			let par = document.createElement("p");
			par.innerText = card["text"];
			div.appendChild(par);

			let img = document.createElement("img");
			
			img.className = "lazyGif";
			img.dataset.src = card["gif"];
			div.appendChild(img);

			listContainer.appendChild(div);

			hr = document.createElement("hr");
			hr.className = "splitter";
			hr.style.opacity = "50%";
			listContainer.appendChild(hr);
		}
		// Remove the last divider added for this unit so the section ends without a trailing line.
		listContainer.removeChild(hr);
		hr = document.createElement("hr");
		hr.className = "splitter";
		listContainer.appendChild(hr);
	}

	// Remove the final section divider after all units have been rendered.
	listContainer.removeChild(hr);

	initializeIntersectionObserver();
}

function initializeIntersectionObserver() {
	const lazyLoadedGifs = document.querySelectorAll(".lazyGif");

  // configs for the intersection observer
	const config = {
		root: null, 
		rootMargin: "200px 0px", 
		threshold: 0.01 
	};

  // observer watches all gifs
	const gifObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
      		// checks if the gif is in the viewport or 
	  		// 200px below then loads the gif by
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				observer.unobserve(img);
			}
		});
	}, config);

	// make the intersection observer watch every gif
	lazyLoadedGifs.forEach(gif => gifObserver.observe(gif));
}


function goBack() {
	window.location.href = "index.html";
}

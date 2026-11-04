let cardList = [];
let side = "asl";

bootCards();

const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
	if (window.scrollY > 300) {
		scrollToTopBtn.classList.add("show");
	}
	else {
		scrollToTopBtn.classList.remove("show");
	}
});

scrollToTopBtn.addEventListener("click", () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
});


async function bootCards(){
    const response = await fetch("./cards.json");
    const data = await response.json();
    const units = (new URLSearchParams(window.location.search).get("units") ?? "100").split(",").map(Number);
    side = (new URLSearchParams(window.location.search).get("front") ?? "asl");
	const listContainer = document.getElementById("listContainer");

	listContainer.style.justifyContent = "normal";
	listContainer.style.display = "grid";
	listContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
	listContainer.style.paddingLeft = "0";
	listContainer.style.paddingRight = "0";

	document.getElementById("headerDiv").innerHTML = "<h3> " + ((units.length > 1) ? "Units" : "Unit") + " " + units.slice(0, -1).join(", ") + ((units.length > 1) ? ", and " : "") + units.slice(-1) + " selected</h3>"

    for (let i = 1;i <= 24;i++){
        if (units.includes(i)){
			cardList.push([]);
			cardList[cardList.length - 1][0] = i;
			cardList[cardList.length - 1].push(...Object.values(data[`Unit${i}`]))

        }
    }

	let hr;

	for (let unit of cardList) {
		let title = document.createElement("h1");
		if (cardList.length > 1) {
			title.textContent = "Unit " + unit[0];
			title.style.gridColumn = "1 / -1";
			title.style.fontSize = "3.5rem";
			title.style.marginTop = "0";
			title.style.marginBottom = "0";
			listContainer.appendChild(title);
			hr = document.createElement("hr");
			hr.className = "splitter";
			hr.style.height = "20%";
			listContainer.appendChild(hr);
		}

		for (let card of unit) {
			if (Number.isFinite(card)) continue;
			let par = document.createElement("p");
			par.innerText = card["text"];
			par.style.textAlign = "center";
			listContainer.appendChild(document.createElement("p")).innerText = card["text"];
			let img = document.createElement("img")
			img.src = card["gif"];
			img.style.maxWidth = "100%";
			img.style.minWidth = "70%";
			listContainer.appendChild(img);
			hr = document.createElement("hr");
			hr.className = "splitter";
			hr.style.opacity = "50%";
			listContainer.appendChild(hr);
		}
		listContainer.removeChild(hr);
		hr = document.createElement("hr");
		hr.className = "splitter";
		hr.style.height = "20%";
		listContainer.appendChild(hr);
	}

	listContainer.removeChild(hr);
}

function goBack(){
    window.location.href = "index.html";
}





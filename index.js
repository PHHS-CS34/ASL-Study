let unitsSelected = [];
const copyPopup = document.getElementById("copy");
copyPopup.querySelector(".close-btn").addEventListener("click", () => {
    copyPopup.close();
});
const notEnoughUnitsPopup = document.getElementById("notEnoughUnits");
notEnoughUnitsPopup.querySelector(".close-btn").addEventListener("click", () => {
    notEnoughUnitsPopup.close();
});
const helpPopup = document.getElementById("help");
helpPopup.querySelector(".close-btn").addEventListener("click", () => {
	helpPopup.close();
});


setUpUnits();

function setUpUnits() {

    for (let i = 1; i <= 24; i++){
        const currentButton = document.createElement("button");
        currentButton.className = "unitButton buttons";
		currentButton.title = ("Unit " + i);
        currentButton.id = `unit${i}`;
        currentButton.dataset.uniton = "true";
        currentButton.onclick = function() {decideColorOfButton(`unit${i}`);};
        if (i <= 8){
            document.getElementById("upToTenUnits").appendChild(currentButton);
        } else if (i <= 16){
            document.getElementById("upToTwentyUnits").appendChild(currentButton);
        } else {
            document.getElementById("upToThirtyUnits").appendChild(currentButton);
        }

        const buttonContainer = document.createElement("span");
        buttonContainer.className = "unitText";
        buttonContainer.textContent = `${i}`;
        currentButton.appendChild(buttonContainer);
    }
}

function decideColorOfButton(buttonId){
    const unitButton = document.getElementById(buttonId);
    if (unitButton.dataset.uniton === "true"){
        unitButton.style.backgroundColor = "var(--color-background4)";
        unitButton.style.color = "var(--color-lightText)";
        unitButton.dataset.uniton = "false";
        if (buttonId !== "aslOrEnglish"){
            unitsSelected.push(unitButton);
        }
    }
    else {
        unitButton.style.backgroundColor = '';
        unitButton.style.color = '';
        unitButton.dataset.uniton = "true";
        if (buttonId !== "aslOrEnglish"){
            unitsSelected.splice(unitsSelected.indexOf(unitButton),1);
        }
    }
}

function decideImageOfButton(buttonId){
    const unitButton = document.getElementById(buttonId);
    const unitButtonIcon = unitButton.querySelector('img')
    if (unitButton.dataset.aslOrEnglish === "asl"){
        unitButtonIcon.src = "media/ENG.svg"
        unitButton.dataset.aslOrEnglish = "eng";
    }
    else {
        unitButton.dataset.aslOrEnglish = "asl";
        unitButtonIcon.src = "media/ASL.svg"
    }
	// unitButton.title = ("Unit" + unitsSelected.indexOf(unitButton));
}

function openSelectedFlash(){
    if (unitsSelected.length !== 0){
        window.location.href = setUpLink("flash");
    } else {
		notEnoughUnitsPopup.showModal();
    }
}

function openSelectedList(){
    if (unitsSelected.length != 0){
        window.location.href = setUpLink("list");
    } else {
        notEnoughUnitsPopup.showModal();
    }
}

function copySelected(){
    if (unitsSelected.length !== 0){
        copyPopup.querySelector("p").textContent = `Copied link to your clipboard`;
        navigator.clipboard.writeText(setUpLink());
    }
    else {
        copyPopup.querySelector("p").textContent = "Not enough units to copy";
    }
    copyPopup.showModal();
}

function setUpLink(type = "flash") {
    let link = type === "flash" ? "flashcards.html?front=" : "list.html?front=";
		// add if the front is ASL or English to the link
	link += document.getElementById("whichFront").dataset.aslOrEnglish;
	link += "&units=";

	let sortedUnits = [];

	for (let i = 0; i < unitsSelected.length; i++) {
		sortedUnits.push(unitsSelected[i].id.slice(4));
	}

	sortedUnits = sortedUnits.map(Number).sort((a, b) => a - b);

    for (let i = 0; i < sortedUnits.length; i++) {
        link += String(sortedUnits[i]) + ((i === sortedUnits.length - 1) ? "" : ",");
    }

    return link;
}

function clearUnits(){
    unitsSelected.slice().forEach(button => {
        decideColorOfButton(button.id);
    });
}

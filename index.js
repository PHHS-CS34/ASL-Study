let unitsSelected = [];
const copypopup = document.getElementById("copy");
copypopup.querySelector(".close-btn").addEventListener("click", () => {
    copypopup.close();
});
const notEnoughUnitsPopup = document.getElementById("notEnoughUnits");
notEnoughUnitsPopup.querySelector(".close-btn").addEventListener("click", () => {
    notEnoughUnitsPopup.close();
});


setUpUnits();

function setUpUnits(){

    for (let i = 1; i <= 24; i++){
        const currentButton = document.createElement("button");
        currentButton.className = "unitButton buttons";
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

        const myInsides = document.createElement("p");
        myInsides.className = "unitText";
        myInsides.textContent = `${i}`;
        currentButton.appendChild(myInsides);
    }
}

function decideColorOfButton(buttonId){
    const myButt = document.getElementById(buttonId);
    if (myButt.dataset.uniton === "true"){
        myButt.style.backgroundColor = "var(--color-background4)";
        myButt.style.color = "var(--color-lightText)";
        myButt.dataset.uniton = "false";
        if (buttonId != "aslorenglish"){
            unitsSelected.push(myButt);
        }
    }
    else {
        myButt.style.backgroundColor = "var(--color-background3)";
        myButt.style.color = "var(--color-darkText)";
        myButt.dataset.uniton = "true";
        if (buttonId != "aslorenglish"){
            unitsSelected.splice(unitsSelected.indexOf(myButt),1);
        }
    }
}

function decideImageOfButton(buttonId){
    const myButt = document.getElementById(buttonId);
    const myButtIcon = myButt.querySelector('img')
    if (myButt.dataset.aslorenglish === "asl"){
        myButtIcon.src = "media/ENG.svg"
        myButt.dataset.aslorenglish = "eng";
    }
    else {
        myButt.dataset.aslorenglish = "asl";
        myButtIcon.src = "media/ASL.svg"
    }
}

function openSelectedFlash(){
    if (unitsSelected.length != 0){
        window.location.href = setUpLink("flash");
    } else {
        alert("Not enough units to open");
    }
}

function openSelectedList(){
    if (unitsSelected.length != 0){
        window.location.href = setUpLink("list");
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
    if (unitsSelected.length != 0){
        copypopup.querySelector("p").textContent = `Copied link to your clipboard`;
        navigator.clipboard.writeText(setUpLink());
    }
    else {
        copypopup.querySelector("p").textContent = "Not enough units to copy";
    }
    copypopup.showModal();
}

function setUpLink(type = "flash") {
    let link = type === "flash" ? "flashcards.html?front=" : "list.html?front=";
		// add if the front is ASL or English to the link
	link += document.getElementById("whichFront").dataset.aslorenglish;
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

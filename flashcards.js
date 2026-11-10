let FullList = [];
let quizList = [];
let backStart = false;
let currentCard = 0;
const perspectiveCardDiv = document.getElementById("perspectiveCardDiv");
const front = document.getElementById("front");
const back = document.getElementById("back");
const lazyCard = document.getElementById("lazy");
const frontsideNumber = document.getElementById("frontsideNumber");
const backsideNumber = document.getElementById("backsideNumber");
const whichFront = document.getElementById("whichFront");
const whichFrontImg = whichFront.querySelector("img");
const helpPopup = document.getElementById("help");

helpPopup.querySelector(".close-btn").addEventListener("click", () => {
	helpPopup.close();
});

function flip(element){
    element.classList.toggle("flipped");
}

async function fetchCards(){
    const response = await fetch("./cards.json");
    const data = await response.json();
    const units = (new URLSearchParams(window.location.search).get("units") ?? "100").split(",").map(Number);
    const side = (new URLSearchParams(window.location.search).get("front") ?? "asl");
    if (side === "asl") {
        backStart = false;
        whichFront.dataset.aslorenglish = "asl";
        whichFrontImg.src = "media/ASL.svg";
    } else if (side === "eng"){
        backStart = true;
        whichFront.dataset.aslorenglish = "eng";
        whichFrontImg.src = "media/ENG.svg";
    } else {
        console.log("ERROR WITH CARD FETCH")
    }

    for (let i = 1;i <= 30;i++){
        if (units.includes(i)){
            FullList.push(...Object.values(data[`Unit${i}`]))
            quizList.push(...Object.values(data[`Unit${i}`]))
        }
    }
    shuffle();
    if (backStart) {
        showENGCard();
    } else {
        showASLCard();
    }
}

function backflip(){
    backStart = !backStart;
    if (backStart) {
        // Start on English
        whichFront.dataset.aslorenglish = "eng";
        whichFrontImg.src = "media/ENG.svg";
    } else {
        // Start on ASL
        whichFront.dataset.aslorenglish = "asl";
        whichFrontImg.src = "media/ASL.svg";
    }
}

function showEndOfDeck(){
	let list = (isInQuizMode()) ? quizList : FullList;
	front.querySelector("img")?.remove();
    back.querySelector("img")?.remove();
    back.querySelector(".mainText").textContent = "You have learned the deck";
    front.querySelector(".mainText").textContent = "You have learned the deck";
    let imge = document.createElement('img');
    back.appendChild(imge);
    imge.src = list[currentCard].gif;
    frontsideNumber.textContent = (currentCard + 1) + " / " + list.length;
    backsideNumber.textContent = (currentCard + 1) + " / " + list.length;
}

function showASLCard() {
	let list = (isInQuizMode()) ? quizList : FullList;
    front.querySelector("img")?.remove();
    back.querySelector("img")?.remove();
    front.querySelector(".mainText").textContent = "";
    back.querySelector(".mainText").textContent = list[currentCard].text;
    let imge = document.createElement('img');
    front.appendChild(imge);
    imge.src = list[currentCard].gif;
    frontsideNumber.textContent = (currentCard + 1) + " / " + list.length;
    backsideNumber.textContent = (currentCard + 1) + " / " + list.length;
	lazyLoadASLImgs();
}

function isImageDownloaded(imageUrl) {
	return performance.getEntriesByType('resource').some(entry => entry.name === imageUrl);
}

function lazyLoadASLImgs() {
	let list = (isInQuizMode()) ? quizList : FullList;
	// if it is the last card, only check that the previous img is loaded
	if (currentCard + 1 === list.length) {
		if (!isImageDownloaded(list[currentCard - 1].gif)) {
			lazyLoadImg(list[currentCard - 1].gif);
		}

	}
	// if it is the first card, only check that the next img and the last img is loaded
	else if (currentCard === 0) {
		if (!isImageDownloaded(list[currentCard + 1].gif)) {
			lazyLoadImg(list[currentCard + 1].gif);
		}
		if (!isImageDownloaded(list[list.length - 1].gif)) {
			lazyLoadImg(list[list.length - 1].gif);
		}
	}
	// for all other cards, check that the prev and next img is loaded
	else {
		if (!isImageDownloaded(list[currentCard + 1]).gif) {
			lazyLoadImg(list[currentCard + 1].gif);
		}
		if (!isImageDownloaded(list[currentCard - 1].gif)) {
			lazyLoadImg(list[currentCard - 1].gif);
		}
	}
}

function lazyLoadImg(imageUrl) {
	lazyCard.querySelector("img")?.remove();
	let imge = document.createElement('img');
	lazyCard.appendChild(imge);
	imge.src = imageUrl;
}

function showENGCard() {
	let list = (isInQuizMode()) ? quizList : FullList;
    front.querySelector("img")?.remove();
    back.querySelector("img")?.remove();
    back.querySelector(".mainText").textContent = "";
    front.querySelector(".mainText").textContent = list[currentCard].text;
    let imge = document.createElement('img');
    back.appendChild(imge);
    imge.src = list[currentCard].gif;
    frontsideNumber.textContent = (currentCard + 1) + " / " + list.length;
    backsideNumber.textContent = (currentCard + 1) + " / " + list.length;
}

async function nextCard(){
	let list = (isInQuizMode()) ? quizList : FullList;
    // increments and protects against overflow
    // needs to use special modulo formula because js is wack
	if (isInQuizMode()){
		list.splice(currentCard,1);
		currentCard = (currentCard != trueMod(currentCard, list.length) ? currentCard - 1 : currentCard);
	} else {
		currentCard = trueMod(currentCard+1, list.length);
	}
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
	if (list.length <= 0){
		showEndOfDeck();	
	} else if (backStart) {
        showENGCard();
    } else {
        showASLCard();
    }
    requestAnimationFrame(() => {
        perspectiveCardDiv.classList.remove("no-transition");
    });
}

async function previousCard(){
	let list = (isInQuizMode()) ? quizList : FullList;
	// decrements and protects against overflow
	// needs to use special modulo formula because js is wack
	if (isInQuizMode()){
		currentCard = trueMod(currentCard+1, list.length);
	} else {
		currentCard = trueMod(currentCard-1, list.length);
	}
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
    if (backStart) {
        showENGCard();
    } else {
        showASLCard();
    }
    requestAnimationFrame(() => {
        perspectiveCardDiv.classList.remove("no-transition");
    });
}

// key listener for space with some extra kaleb stuff?
window.addEventListener("keydown", (e) => {
    if (e.key === " " && ['BUTTON', 'INPUT', 'A', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
    }
});

// key listener that deals with up/down for flipping, left/right for traversing cards
document.addEventListener("keydown", async function(event) {
    switch (event.key){
        case " ":
        case "w":
        case "s":
        case "ArrowUp":
        case "ArrowDown":
            perspectiveCardDiv.classList.toggle("flipped");
            break;
        case "ArrowLeft":
        case "a":
            await previousCard();
            break;
        case "ArrowRight":
        case "d":
            await nextCard();
            break;
    }
});

function goBack(){
    window.location.href = "index.html";
}

function quizToggle(){
	let previousCard = document.getElementById("previousCardButton");
	let prevImage = previousCard.querySelector("img");
	let prevH1 = previousCard.querySelector("h1");
	let nextCard = document.getElementById("nextCardButton");
	let nextImage = nextCard.querySelector("img");
	let nextH1 = nextCard.querySelector("h1");
	if (!isInQuizMode()){
		previousCard.title = "Don't know (keep in list)";
		nextCard.title = "Do know (take out of list)";
		prevImage.style.display = "none";
		nextImage.style.display = "none";
		prevH1.hidden = false;
		nextH1.hidden = false;
	} else {
		previousCard.title = "Go to the previous card";
		nextCard.title = "Go to the next card";
		prevImage.style.display = "block";
		nextImage.style.display = "block";
		prevH1.hidden = true;
		nextH1.hidden = true;
	}
	if (backStart) {
        showENGCard();
    } else {
        showASLCard();
    }
}

function isInQuizMode(){
	return !document.getElementById("previousCardButton").querySelector("h1").hidden;
}

function shuffle(){
    for (let i = FullList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [FullList[i], FullList[j]] = [FullList[j], FullList[i]];
    }
    currentCard = 0;
    if (backStart) {
        showENGCard();
    } else {
        showASLCard();
    }
}

// I'm so glad JS uses a mathematically inaccurate modulo %
// smh
function trueMod(a,b){
	return ((a % b) + b) % b;
}

void fetchCards();

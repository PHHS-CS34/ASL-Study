let cardList = [];
let backstart = false;
const flipStartTerm = document.getElementById("flipStartTerm");
let currentCard = 0;
const perspectiveCardDiv = document.getElementById("perspectiveCardDiv");
const front = document.getElementById("front");
const back = document.getElementById("back");
const lazyCard = document.getElementById("lazy");
const frontsideNumber = document.getElementById("frontsideNumber");
const backsideNumber = document.getElementById("backsideNumber");
const whichFront = document.getElementById("whichFront");
const whichFrontImg = whichFront.querySelector("img");
const helppopup = document.getElementById("help");

helppopup.querySelector(".close-btn").addEventListener("click", () => {
	helppopup.close();
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
        backstart = false;
        whichFront.dataset.aslorenglish = "asl";
        whichFrontImg.src = "media/ASL.svg";
    } else if (side === "eng"){
        backstart = true;
        whichFront.dataset.aslorenglish = "eng";
        whichFrontImg.src = "media/ENG.svg";
    } else {
        console.log("ERROR WITH CARD FETCH")
    }

    for (let i = 1;i <= 30;i++){
        if (units.includes(i)){
            cardList.push(...Object.values(data[`Unit${i}`]))
        }
    }
    shuffle();
    if (backstart) {
        showENGCard();
    } else {
        showASLCard();
    }
}

function backflip(){
    backstart = !backstart;
    if (backstart) {
        // Start on English
        whichFront.dataset.aslorenglish = "eng";
        whichFrontImg.src = "media/ENG.svg";
    } else {
        // Start on ASL
        whichFront.dataset.aslorenglish = "asl";
        whichFrontImg.src = "media/ASL.svg";
    }
}

function showASLCard() {
    front.querySelector("img")?.remove();
    back.querySelector("img")?.remove();
    front.querySelector(".mainText").textContent = "";
    back.querySelector(".mainText").textContent = cardList[currentCard].text;
    let imge = document.createElement('img');
    front.appendChild(imge);
    imge.src = cardList[currentCard].gif;
    frontsideNumber.textContent = (currentCard + 1) + " / " + cardList.length;
    backsideNumber.textContent = (currentCard + 1) + " / " + cardList.length;
	lazyLoadASLImgs();
}

function isImageDownloaded(imageUrl) {
	const hasMatchingRequest = performance.getEntriesByType('resource')
    .some(entry => entry.name === imageUrl);

	return hasMatchingRequest;
}

function lazyLoadASLImgs() {
	// if it is the last card, only check that the previous img is loaded
	if (currentCard + 1 == cardList.length) {
		if (!isImageDownloaded(cardList[currentCard - 1].gif)) {
			lazyLoadImg(cardList[currentCard - 1].gif);
		}

	}
	// if it is the first card, only check that the next img and the last img is loaded
	else if (currentCard == 0) {
		if (!isImageDownloaded(cardList[currentCard + 1].gif)) {
			lazyLoadImg(cardList[currentCard + 1].gif);
		}
		if (!isImageDownloaded(cardList[cardList.length - 1].gif)) {
			lazyLoadImg(cardList[cardList.length - 1].gif);
		}
	}
	// for all other cards, check that the prev and next img is loaded
	else {
		if (!isImageDownloaded(cardList[currentCard + 1]).gif) {
			lazyLoadImg(cardList[currentCard + 1].gif);
		}
		if (!isImageDownloaded(cardList[currentCard - 1].gif)) {
			lazyLoadImg(cardList[currentCard - 1].gif);
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
    front.querySelector("img")?.remove();
    back.querySelector("img")?.remove();
    back.querySelector(".mainText").textContent = "";
    front.querySelector(".mainText").textContent = cardList[currentCard].text;
    let imge = document.createElement('img');
    back.appendChild(imge);
    imge.src = cardList[currentCard].gif;
    frontsideNumber.textContent = (currentCard + 1) + " / " + cardList.length;
    backsideNumber.textContent = (currentCard + 1) + " / " + cardList.length;
}

async function nextCard(){
    // increments and protects against overflow
    // needs to use special modulo formula because js is wack
    currentCard = trueMod(currentCard+1, cardList.length);
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
    if (backstart) {
        showENGCard();
    } else {
        showASLCard();
    }
    requestAnimationFrame(() => {
        perspectiveCardDiv.classList.remove("no-transition");
    });
}

async function previousCard(){
	// decrements and protects against overflow
	// needs to use special modulo formula because js is wack
	currentCard = trueMod(currentCard-1, cardList.length);
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
    if (backstart) {
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

function shuffle(){
    for (let i = cardList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }
    currentCard = 0;
    if (backstart) {
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

fetchCards();

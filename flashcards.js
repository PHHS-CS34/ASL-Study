let FullList = [];
let quizList = [];
let trueCount = 0;
let quizTempCount = 0;
let backStart = false;
let currentCard = 0;
let quizCurrentCard = 0;
let realCurrentCard = 0;
const perspectiveCardDiv = document.getElementById("perspectiveCardDiv");
const front = document.getElementById("front");
const back = document.getElementById("back");
const lazyCard = document.getElementById("lazy");
const frontsideNumber = document.getElementById("frontsideNumber");
const backsideNumber = document.getElementById("backsideNumber");
const whichFront = document.getElementById("whichFront");
const whichFrontImg = whichFront.querySelector("img");
const helpPopup = document.getElementById("help");
const endOfListPopup = document.getElementById("endOfList");
endOfListPopup.showModal();
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
	quizTempCount = quizList.length;
    shuffle();
    showCard();
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

function showCard(){
	let list = (isInQuizMode()) ? quizList : FullList;
	let frontLang = (backStart) ? back : front;
	let backLang = (backStart) ? front : back;
    frontsideNumber.textContent = backsideNumber.textContent = (isInQuizMode()) ? ((quizList.length == 0) ? ("EMPTY") : ((trueCount + 1) + " / " + quizTempCount)) : ((currentCard + 1) + " / " + list.length);
	frontLang.querySelector("img")?.remove();
	backLang.querySelector("img")?.remove();
	if (list.length <= 0){
		frontLang.querySelector(".mainText").textContent = "";
		backLang.querySelector(".mainText").textContent = "";
		endOfListPopup.showModal();
		return
	}
	frontLang.querySelector(".mainText").textContent = "";
	backLang.querySelector(".mainText").textContent = list[currentCard].text;
	let image = document.createElement('img');
	image.src = list[currentCard].gif;
	frontLang.appendChild(image);
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

async function nextCard(){
	let list = (isInQuizMode()) ? quizList : FullList;
	console.log(list);
	if (list.length <= 0) return;
    // increments and protects against overflow
    // needs to use special modulo formula because js is wack
	if (isInQuizMode()){
		list.splice(currentCard,1);
		trueCount ++;
		if (currentCard != trueMod(currentCard, list.length)) {
			currentCard --;
		} 
		if (trueCount + 1 > quizTempCount) {
			currentCard = 0;
			trueCount = 0;
			quizTempCount  = quizList.length;
		}
	} else {
		currentCard = trueMod(currentCard+1, list.length);
	}
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
	showCard();
    requestAnimationFrame(() => {
        perspectiveCardDiv.classList.remove("no-transition");
    });
}

async function previousCard(){
	let list = (isInQuizMode()) ? quizList : FullList;
	if (list.length <= 0) return;
	// decrements and protects against overflow
	// needs to use special modulo formula because js is wack
	if (isInQuizMode()){
		trueCount ++;
		if (currentCard + 1 != trueMod(currentCard + 1, quizList.length)) {
			trueCount = 0;
			quizTempCount = quizList.length;
		} 
		currentCard = trueMod(currentCard+1, list.length);
	} else {
		currentCard = trueMod(currentCard-1, list.length);
	}
    perspectiveCardDiv.classList.add("no-transition");
    perspectiveCardDiv.classList.remove("flipped");
    showCard();
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
	let quizImg = document.getElementById("quizToggle");
	if (!isInQuizMode()){
		quizImg.src = "media/exitQuiz";
		quizImg.alt = "exit quiz mode";
		previousCard.title = nextCard.title = "Don't know (keep in list)";
		prevImage.style.display = nextImage.style.display = "none";
		prevH1.hidden = nextH1.hidden = false;
		realCurrentCard = currentCard;
		currentCard = quizCurrentCard;
	} else {
		quizImg.src = "media/enterQuiz";
		quizImg.alt = "enter quiz mode";
		previousCard.title = nextCard.title = "Go to the previous card";
		prevImage.style.display = nextImage.style.display = "block";
		prevH1.hidden = nextH1.hidden = true;
		quizCurrentCard = currentCard;
		currentCard = realCurrentCard;
	}
	showCard();
}

function isInQuizMode(){
	return !document.getElementById("previousCardButton").querySelector("h1").hidden;
}

function shuffle(){
	let list = (isInQuizMode()) ? quizList : FullList;
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
	if (isInQuizMode()){
		quizCurrentCard = realCurrentCard = 0;
		quizTempCount = quizList.length;
	} else {
		currentCard = 0;
	}
    showCard();
}

// I'm so glad JS uses a mathematically inaccurate modulo %
// smh
function trueMod(a,b){
	return ((a % b) + b) % b;
}

void fetchCards();

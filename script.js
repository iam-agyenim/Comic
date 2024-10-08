// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Variables for start page and comic section
const startPage = document.getElementById('start-page');
const comicSection = document.getElementById('comic-section');
const startButton = document.getElementById('start-btn');

// Variables for comic navigation
const comicImage = document.getElementById('comicImage');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Variables for choice buttons
const choiceContainer = document.getElementById('choice-container');
const choiceAButton = document.getElementById('choiceA-btn');
const choiceBButton = document.getElementById('choiceB-btn');
const beginButton = document.getElementById('begin-btn');
const endButton = document.getElementById('end-btn');

// Get the audio elements
const choiceAudio = document.getElementById('choiceAudio');
const gameOverAudio = document.getElementById('gameOverAudio');
const panelAudio = document.getElementById('panelAudio');
const doorBreakAudio = document.getElementById('doorBreakAudio');

// Comic pages array
const comicPages = [
    'Panel_1.png', 'Panel_2.png', 'Panel_3.png', 
    'Panel_4a.png', 'Panel_5a.png', 'Panel_6a.png', 
    'Panel_4b.png', 'Panel_5b.png', 'Panel_6b.png', 
    'Panel_4c.png', 'Panel_5c.png'
];

let currentPage = 0;
let choiceTimeout;

// Function to reset all states
function resetAll() {
    currentPage = 0;
    choiceAudio.pause();
    choiceAudio.currentTime = 0;
    gameOverAudio.pause();
    gameOverAudio.currentTime = 0;
    doorBreakAudio.pause();
    doorBreakAudio.currentTime = 0;
}

// Function to play panel audio
function playPanelAudio() {
    panelAudio.volume = 0.2;
    panelAudio.loop = true;
    panelAudio.play().catch((error) => {
        console.log("Autoplay prevented on panel audio: " + error);
    });
}

// Function to handle the Begin button click
function onBeginButtonClick() {
    resetAll();
    playPanelAudio();
    currentPage = 0;
    updateComicPage();
}

// Function to handle the End button click
function onEndButtonClick() {
    resetAll();
    currentPage = 0;
    updateComicPage();
}

// Function to update comic page
function updateComicPage() {
    comicImage.src = comicPages[currentPage];
    choiceContainer.style.display = 'none';
    beginButton.style.display = 'none';
    endButton.style.display = 'none';

    prevBtn.style.display = (currentPage === 0 || currentPage === 2 || currentPage === 5 || currentPage === 8 || currentPage === 10) ? 'none' : 'inline-block';

    if (currentPage === 2) {
        nextBtn.style.display = 'none';
        choiceContainer.style.display = 'block';
        choiceAButton.style.display = 'inline-block';
        choiceBButton.style.display = 'inline-block';

        choiceAudio.play().catch((error) => {
            console.log("Autoplay prevented on the choice page: " + error);
        });

        choiceTimeout = setTimeout(() => {
            currentPage = 9;
            updateComicPage();
        }, 15000);
    } else if (currentPage === 5 || currentPage === 8 || currentPage === 10) {
        choiceContainer.style.display = 'inline-block';
        beginButton.style.display = 'inline-block';
        endButton.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        choiceAButton.style.display = 'none';
        choiceBButton.style.display = 'none';

        gameOverAudio.play();

        choiceAudio.pause();
        choiceAudio.currentTime = 0;

        panelAudio.pause();
        panelAudio.currentTime = 0;
    } else {
        choiceAudio.pause();
        choiceAudio.currentTime = 0;
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = currentPage >= comicPages.length - 1;
    }

    if (currentPage === 4 || currentPage === 7) {
        doorBreakAudio.play().catch((error) => {
            console.log("Autoplay prevented on door break audio: " + error);
        });
    }
}

// Add event listeners to the Begin and End buttons
beginButton.addEventListener('click', onBeginButtonClick);
endButton.addEventListener('click', onEndButtonClick);

// Start the panel audio when the script loads
playPanelAudio();

// Start Button - Hide start page and show comic section when clicked
startButton.addEventListener('click', () => {
    resetAll();
    startPage.style.display = 'none';
    comicSection.style.display = 'block';
    updateComicPage();
});

// Event listener for the End button (Returns to the start page)
endButton.addEventListener('click', () => {
    comicSection.style.display = 'none';
    startPage.style.display = 'flex';
    resetAll();
});

// Previous button event listener
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateComicPage();
    }
});

// Next button event listener
nextBtn.addEventListener('click', () => {
    if (currentPage < comicPages.length - 1) {
        currentPage++;
        updateComicPage();
    }
});

// Choice button event listeners
choiceAButton.addEventListener('click', () => {
    clearTimeout(choiceTimeout);
    currentPage = 3;
    choiceAButton.style.display = 'none';
    choiceBButton.style.display = 'none';
    updateComicPage();
});

choiceBButton.addEventListener('click', () => {
    clearTimeout(choiceTimeout);
    currentPage = 6;
    choiceAButton.style.display = 'none';
    choiceBButton.style.display = 'none';
    updateComicPage();
});

// Initialize the comic display on load
updateComicPage();

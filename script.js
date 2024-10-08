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
const prevBtn = document.querySelector('.prev'); // Keeping Previous button for allowed pages
const nextBtn = document.querySelector('.next'); // Keeping Next button

// Variables for choice buttons
const choiceContainer = document.getElementById('choice-container');
const choiceAButton = document.getElementById('choiceA-btn');
const choiceBButton = document.getElementById('choiceB-btn');
const beginButton = document.getElementById('begin-btn'); // Begin button reference
const endButton = document.getElementById('end-btn'); // End button reference

// Get the audio elements
const choiceAudio = document.getElementById('choiceAudio'); // Choice page audio element
const gameOverAudio = document.getElementById('gameOverAudio'); // Game Over audio element
const timerVideo = document.getElementById('timerVideo'); // Timer video element
const panelAudio = document.getElementById('panelAudio'); // Panel-specific audio element
const doorBreakAudio = document.getElementById('doorBreakAudio'); // Door break audio element

// Comic pages array
const comicPages = [
    'Panel_1.png',        // Page 1
    'Panel_2.png',        // Page 2
    'Panel_3.png',        // Page 3 (Choice Page)
    'Panel_4a.png',      // Path A - Comic 1
    'Panel_5a.png',      // Path A - Comic 2
    'Panel_6a.png',      // Path A - Comic 3
    'Panel_4b.png',      // Path B - Comic 1
    'Panel_5b.png',      // Path B - Comic 2
    'Panel_6b.png',      // Path B - Comic 3
    'Panel_4c.png',      // Timeout - Comic 1
    'Panel_5c.png'       // Timeout - Comic 2 (Last page for timeout)
];

let currentPage = 0;
let choiceTimeout;

// Function to reset all states (audio, video, and current page)
function resetAll() {
    currentPage = 0; // Reset to the first page
    choiceAudio.pause(); // Stop choice audio
    choiceAudio.currentTime = 0; // Reset choice audio to the start
    gameOverAudio.pause(); // Stop Game Over audio
    gameOverAudio.currentTime = 0; // Reset Game Over audio to the start
    timerVideo.pause(); // Stop the timer video
    timerVideo.currentTime = 0; // Reset timer video to the beginning
    doorBreakAudio.pause(); // Stop the door break audio
    doorBreakAudio.currentTime = 0; // Reset door break audio to the start
}

// Function to play panel audio continuously with low volume
function playPanelAudio() {
    panelAudio.volume = 0.2; // Set volume to 20%
    panelAudio.loop = true; // Set audio to loop continuously
    panelAudio.play().catch((error) => {
        console.log("Autoplay prevented on panel audio: " + error);
    });
}

// Function to handle the Begin button click
function onBeginButtonClick() {
    resetAll(); // Reset all states
    playPanelAudio(); // Play panel audio again
    currentPage = 0; // Set current page to the beginning
    updateComicPage(); // Update the comic page to show the first panel
}

// Function to handle the End button click
function onEndButtonClick() {
    resetAll(); // Reset all states
    playPanelAudio(); // Play panel audio again
    currentPage = 0; // Optionally set to the beginning or desired end page
    updateComicPage(); // Update the comic page
}

// Function to update comic page
function updateComicPage() {
    comicImage.src = comicPages[currentPage]; // Change the comic image
    choiceContainer.style.display = 'none';  // Hide choices by default
    beginButton.style.display = 'none'; // Hide Begin button by default
    endButton.style.display = 'none'; // Hide End button by default

    // Handle visibility of Previous button
    prevBtn.style.display = (currentPage === 0 || currentPage === 2 || currentPage === 5 || currentPage === 8 || currentPage === 10) ? 'none' : 'inline-block';

    // Manage choice page and end pages
    if (currentPage === 2) {
        nextBtn.style.display = 'none'; // Hide next button
        choiceContainer.style.display = 'block'; // Show choice buttons
        choiceAButton.style.display = 'inline-block';
        choiceBButton.style.display = 'inline-block';
        timerVideo.style.display = 'none'; // Show timer video
        timerVideo.play(); // Play the timer video from the beginning

        // Play sound on the choice page
        choiceAudio.play().catch((error) => {
            console.log("Autoplay prevented on the choice page: " + error);
        });

        // Automatic transition to timeout path if no choice is made
        choiceTimeout = setTimeout(() => {
            currentPage = 9; // Default to timeout path (Panel_4c.png)
            updateComicPage();
        }, 15000); // 15 seconds to choose
    } else if (currentPage === 5 || currentPage === 8 || currentPage === 10) {
        // On the last comic page of each path, show Begin and End buttons
        choiceContainer.style.display = 'inline-block';
        beginButton.style.display = 'inline-block'; // Show Begin button
        endButton.style.display = 'inline-block'; // Show End button
        nextBtn.style.display = 'none'; // Hide next button
        choiceAButton.style.display = 'none'; // Hide choices
        choiceBButton.style.display = 'none'; // Hide choices

        // Play Game Over sound
        gameOverAudio.play(); // Play the Game Over audio

        // Stop and reset choice audio
        choiceAudio.pause(); // Pause the audio on end pages
        choiceAudio.currentTime = 0; // Reset the audio to the beginning

        // Stop the panel audio when game over occurs
        panelAudio.pause(); // Stop panel audio
        panelAudio.currentTime = 0; // Reset panel audio to the beginning
    } else {
        // On all other pages, hide the timer video and stop the audio
        timerVideo.style.display = 'none'; // Hide timer video on other pages
        choiceAudio.pause(); // Stop the audio on other pages
        choiceAudio.currentTime = 0; // Reset audio to the start
        nextBtn.style.display = 'inline-block'; // Show the next button
        nextBtn.disabled = currentPage >= comicPages.length - 1; // Disable next on the last page
    }

    // Play door break audio for panels 5a and 5b
    if (currentPage === 4 || currentPage === 7 ) {
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
    resetAll(); // Reset all states
    startPage.style.display = 'none'; // Hide start page
    comicSection.style.display = 'block'; // Show comic section
    timerVideo.play(); // Play the timer video from the beginning
    updateComicPage(); // Begin the comic from page 0
});

// Event listener for the Begin button (Resets comic to the start)
beginButton.addEventListener('click', () => {
    resetAll(); // Reset all states
    updateComicPage(); // Refresh the comic display
});

// Event listener for the End button (Returns to the start page)
endButton.addEventListener('click', () => {
    comicSection.style.display = 'none'; // Hide comic section
    startPage.style.display = 'flex'; // Show start page
    resetAll(); // Reset all states
});

// Previous button event listener
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--; // Move to the previous comic page
        updateComicPage(); // Refresh the comic display
    }
});

// Next button event listener
nextBtn.addEventListener('click', () => {
    if (currentPage < comicPages.length - 1) {
        currentPage++; // Move to the next comic page
        updateComicPage(); // Refresh the comic display
    }
});

// Choice button event listeners
choiceAButton.addEventListener('click', () => {
    clearTimeout(choiceTimeout); // Clear timeout for choices
    currentPage = 3; // Navigate to path A (Panel_4a.png)
    updateComicPage(); // Refresh the comic display

});

choiceBButton.addEventListener('click', () => {
    clearTimeout(choiceTimeout); // Clear timeout for choices
    currentPage = 6; // Navigate to path B (Panel_4b.png)
    updateComicPage(); // Refresh the comic display
});

// Initialize the comic display on load
updateComicPage();



// ---------- constant values and html dom reference ---------- 

const yearMin = 1776;
const yearMax = 2018;
const playRate = 1000; // one year of increment per 1000 millisecond

const eventColorCode = {
    'establish legation' : '',
    'elevate to embassy' : '',
    'closure' : '',
    'reopen embassy' : ''
}

const yearSlider = document.getElementById('yearslider');
const yearLabel = document.getElementById('yearlabel');
const playButton = document.getElementById('playbutton');
const playButtonIcon = document.getElementById('playbuttonicon');

// ---------- initialize the slidebar elements ---------------- 

// add attributes to year slidebar
yearSlider.setAttribute('min', yearMin);
yearSlider.setAttribute('max', yearMax);
yearSlider.setAttribute('value', yearMin);
// set the initvalue of year slider label
yearLabel.innerText = yearSlider.value;

// ---------- initialize state variables ---------------------- 
var states = {
    currentYear : yearSlider.value,
    playButtonIsPlaying : false
}

// ---------- slidebar event handler -------------------------- 

// change the current year and label display
const onSlidebarChangeEvent = () => {
    states.currentYear = yearSlider.value;
    yearLabel.innerText = yearSlider.value;
}
yearSlider.addEventListener('input', () => {
    onSlidebarChangeEvent();
    yearSlider.addEventListener('change', onSlidebarChangeEvent);
});
yearSlider.addEventListener('change', () => {
    onSlidebarChangeEvent();
    yearSlider.removeEventListener('input', onSlidebarChangeEvent);
}); 

// the play icon and timeline animation
const onPlaying = () => {
    if (states.playButtonIsPlaying){
        if (states.currentYear < yearMax){
            yearSlider.value = Number(yearSlider.value) + 1;
            onSlidebarChangeEvent();
        } else {
            playButton.click();
        }
    }
}
const onPlayButtonClick = () => {
    states.playButtonIsPlaying = !states.playButtonIsPlaying;
    if (states.playButtonIsPlaying){
        // update the play icon
        playButtonIcon.className = "";
        playButtonIcon.classList.add('icon-pause');

    } else {
        // update the play icon
        playButtonIcon.className = "";
        playButtonIcon.classList.add('icon-play');
    }
}
playButton.addEventListener('click', () => onPlayButtonClick());
setInterval(onPlaying, playRate);

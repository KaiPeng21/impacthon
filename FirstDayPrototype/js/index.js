
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
var plotlyData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: [''],
    z: [30],
    text: [''],
    autocolorscale: true
}];
var plotlyLayout = {
    title: 'Learning American Diplomacy History',
    geo: {
        projection: {
            type: 'robinson'
        }
    }
};

// ---------- initialize plotly map ---------------------- 
const unpack = (rows, key) => {
    return rows.map((row) => row[key]);
}
var embassyEventByYear = {};
var embassyEventByCountry = {};
Plotly.d3.csv('../ref/embassy-data.csv', (err, rows) =>{
    // group the ebassy events by year
    embassyEventByYear = rows.reduce((result, row) => {
        if (row['year'] in result) {
            result[row['year']].push({event : row['event'], country : row['country']});
        }else {
            result[row['year']] = [{event : row['event'], country : row['country']}];
        }
        return result;
    }, {});

    // group the embassy events by country name
    embassyEventByCountry = rows.reduce((result, row) => {
        if (row['country'] in result) {
            result[row['country']].push({event : row['event'], year : row['year']});
        }else {
            result[row['country']] = [{event : row['event'], year : row['year']}];
        }
        return result;
    }, {});

    Plotly.plot(worldmap, plotlyData, plotlyLayout, {showLink: false});
});


// -----------------  event handler -------------------------- 


// change the current year and label display
const onSlidebarChangeEvent = () => {
    states.currentYear = yearSlider.value;
    yearLabel.innerText = yearSlider.value;

    if (states.currentYear in embassyEventByYear){
        plotlyData[0]['locations'] = unpack(embassyEventByYear[states.currentYear], 'country');
        plotlyData[0]['text'] = unpack(embassyEventByYear[states.currentYear], 'event');
        console.log('plotlyData ', plotlyData);
        console.log('embassyEventByYear[states.currentYear]: ', embassyEventByYear[states.currentYear]);
        Plotly.newPlot(worldmap, plotlyData, plotlyLayout); 
    }

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



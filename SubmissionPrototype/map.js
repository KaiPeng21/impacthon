const url = "http://plothack.s3-website-us-east-1.amazonaws.com/transformed_data.json";
const major_world_event_api = "http://plothack.s3-website-us-east-1.amazonaws.com/major_world_event.json";

// embassy event data
const fetchData = () => {
    return new Promise((resolve, reject) => {
        return window.fetch(url).then((response) => {
            response.json().then((myJson) => {
                resolve(myJson);
            })
        }).catch(err => console.log(err));
    });
}

// major world event highlight
const fetchMajorWorldEvent = () => {
    return new Promise((resolve, reject) => {
        return window.fetch(major_world_event_api).then((response) => {
            response.json().then((myJson) => {
                resolve(myJson);
            })
        }).catch(err => console.log(err));
    });
}

// amazon polly audios
var audio = null;
const playAudio = (year) => {
    var mp3source = 'https://s3.amazonaws.com/plothack/mp3/' + year + '.mp3';
    try{
        if (audio != null){
            audio.pause();
        }
        var audio = new Audio(mp3source);
        audio.play();
    }catch(err){
        console.log('no mp3 found');
    }
}



Promise.all([
    fetchData(),
    fetchMajorWorldEvent()])
    .then((allData) => {
        
    const embassyEventByYear = allData[0];
    const worldEventData = allData[1];
    // format the world event data
    var majorWorldEvent = worldEventData.reduce((result, row) => {
        if (row['year'] in result) {
            result[row['year']].push({
                event: row['event'],
                img: row['img']
            });
        }else {
            result[row['year']] = [
                {
                    event : row['event'],
                    img: row['img']
                }
                ];
        }
        return result;
    }, {});
    
    var markerOptions = {
        size: [16],
        color: [10],
        cmin: 0,
        cmax: 50,
        opacity: 0.5,
        colorscale: 'Blues',
        line: {
            color: 'black'
        },
        hoverlabel: {
          font: {
            size: 12,
            family: "verdana"
          },
        },
    };
    
     var closedMarkerOptions = {
        size: [16],
        color: [10],
        cmin: 0,
        cmax: 10,
        opacity: 0.5,
        colorscale: 'Reds',
        line: {
            color: 'black'
        },
        hoverlabel: {
          font: {
            size: 12,
            family: "verdana"
          },
        },
    };
    // helper for building hover text
    const buildHoverText = ((dataPoint) => {
        let hoverText = `${dataPoint.country}`;
        if (dataPoint.event) {
            hoverText += ` - ${dataPoint.event}`;
        }
        return hoverText;
    });
    
      const buildDataForFrame = ((currentYear) => {
                    
        let sizeArr = [];
        let colorArr = [];
        let hoverArr = [];
        let lonArr = [];
        let latArr = [];
        let closedLonArr = [];
        let closedLatArr = [];
        let closedHoverArr = [];
        for (let i = 0; i < embassyEventByYear[currentYear].length; i++) {
            var diplomaticStatus = embassyEventByYear[currentYear][i].status;
            var diplomaticEvent = embassyEventByYear[currentYear][i].event;
            if (diplomaticStatus === 1 || diplomaticStatus === 2 || diplomaticStatus === 6) {
                // legation established - use light color
                colorArr.push(30);
            }
            else if (diplomaticEvent !== 'closure') {
                // embassy established
                colorArr.push(10);
            }
            else {
                // closure
            }
            if (diplomaticEvent) {
                // TODO: animate.
            }
            var hoverText = buildHoverText(embassyEventByYear[currentYear][i]);
            if (diplomaticEvent !== 'closure') {
                lonArr.push(embassyEventByYear[currentYear][i].lon);
                latArr.push(embassyEventByYear[currentYear][i].lat);
                sizeArr.push(16);
                hoverArr.push(hoverText);
            }
            else {
                closedLonArr.push(embassyEventByYear[currentYear][i].lon);
                closedLatArr.push(embassyEventByYear[currentYear][i].lat);
                closedHoverArr.push(hoverText);
            }

        }
        let localMarkerOptions = markerOptions;
        localMarkerOptions.size = sizeArr;
        localMarkerOptions.color = colorArr;
        var plotlyData = [];
        plotlyData.push({
            type: 'scattergeo',
            mode: 'markers',
            showlegend: false,
            marker: localMarkerOptions,
            lon: lonArr,
            lat: latArr,
            text: hoverArr,
            hoverinfo: 'text',
            autocolorscale: true
        });
        if (closedLonArr.length) {
            plotlyData.push({
                type: 'scattergeo',
                mode: 'markers',
                showlegend: false,
                marker: closedMarkerOptions,
                lon: closedLonArr,
                lat: closedLatArr,
                text: closedHoverArr,
                hoverinfo: 'text',
                autocolorscale: true
            });
        }
        return plotlyData;
    });
        
    const majorWorldEventLabel = document.getElementById('majorworldevent');
    const triggerYearChangeEvents = (currentYear) => {
        if (currentYear in majorWorldEvent){
            const innerTextValue = `${majorWorldEvent[currentYear][0]['event']} <img src=\"${majorWorldEvent[currentYear][0]['img']}\" />`;
            majorWorldEventLabel.innerHTML = innerTextValue;
            setTimeout(function(){ majorWorldEventLabel.innerText = "" }, 3000);
            playAudio(currentYear);
        }
    }
    
    const frames = [];
    Object.keys(embassyEventByYear).forEach((yearName) => {
      frames.push({
          name: yearName,
          data: buildDataForFrame(yearName)
      });
    });
    
    var firstLonArr = [embassyEventByYear['1779'][0].lon];
    var firstLatArr = [embassyEventByYear['1779'][0].lat];
    var firstHoverArr = [buildHoverText(embassyEventByYear['1779'][0])];
    var mapData = [{
        type: 'scattergeo',
        mode: 'markers',
        lon: firstLonArr,
        lat: firstLatArr,
        text: firstHoverArr,
        hoverinfo: 'text',
        marker: markerOptions,
        showlegend: false
    }];
    

    var slidersConfig = [];
    var sliderSteps = [];
    var yearsArr = Object.keys(embassyEventByYear);
    for (let i = 0; i < yearsArr.length; i++) {
      var yearName = yearsArr[i];
      sliderSteps.push({
        method: 'animate',
        label: yearName,
        args: [[yearName], {
            mode: 'immediate',
            transition: {duration: 300},
            frame: {duration: 300, redraw: false},
        }
      ]
      });
    }
    slidersConfig.push({
        pad: {l: 130, t: 0},
            currentvalue: {
            visible: true,
            prefix: 'Year:',
            xanchor: 'right',
            font: {size: 20, color: '#666'}
        },
        steps: sliderSteps
     });

    var mapLayout = {
        title: 'American Embassies and Legations',
        titlefont: {
            family: "verdana",
            size: 58
        },
        
        
        
        height: 695,
        geo: {
            autosize: true,
            scope: 'world',
            resolution: 110,
            margin: 0,
            showcountries: true,
            showland: true,
            landcolor: 'rgb(217, 217, 217)',
            showlakes: true,
            lakecolor: 'rgb(188, 221, 255))',
            oceancolor: 'rgb(188, 221, 255)',
            projection: {
                type: 'robinson'
            }
        
        },
        
        sliders: slidersConfig,
        updatemenus: [{
          x: 0.1,
          y: 0,
          yanchor: "top",
          xanchor: "right",
          showactive: false,
          direction: "left",
          type: "buttons",
          pad: {"t": 87, "r": 10},
          buttons: [{
            method: "animate",
            args: [null, {
              fromcurrent: true,
              transition: {
                duration: 500,
                 easing: 'linear'
              },
              frame: {
                duration: 200,
                redraw: false
              }
            }],
            label: "Play"
          }, {
            method: "animate",
            args: [
              [null],
              {
                mode: "immediate",
                transition: {
                  duration: 0
                },
                frame: {
                  duration: 0,
                  redraw: false
                }
              }
            ],
            label: "Pause"
          }]
        }]
    };
    const createdPlot = Plotly.plot(worldmap, mapData, mapLayout, {
        showLink: false
    }).then(() => {
        Plotly.addFrames('worldmap', frames);
    });
    worldmap.on('plotly_sliderchange', (event) => {
        triggerYearChangeEvents(event.step.label);
        //console.log(event.step.label);
    })
    
    

    // ---------- constant values and html dom reference ---------- 

    const yearMin = 1779;
    const yearMax = 2015;
    const playRate = 200; // one year of increment per 1000 millisecond

    //const yearSlider = document.getElementById('yearslider');
    //const yearLabel = document.getElementById('yearlabel');
    //const playButton = document.getElementById('playbutton');
    //const playButtonIcon = document.getElementById('playbuttonicon');
    

    // ---------- initialize the slidebar elements ---------------- 

    // add attributes to year slidebar
    /*
    yearSlider.setAttribute('min', yearMin);
    yearSlider.setAttribute('max', yearMax);
    yearSlider.setAttribute('value', yearMin);
    */
    // set the initvalue of year slider label
   // yearLabel.innerText = yearSlider.value;

    // ---------- initialize state variables ---------------------- 
    /*
    var states = {
        currentYear: yearSlider.value,
        playButtonIsPlaying: false
    }
    */


  
    // -----------------  event handler -------------------------- 

    
    // change the current year and label display
    /*
    const onSlidebarChangeEvent = () => {
        states.currentYear = yearSlider.value;
        yearLabel.innerText = yearSlider.value;
        const plotlyData = buildDataForFrame(states.currentYear);

        Plotly.newPlot(worldmap, plotlyData, mapLayout);
        
        // updating the major world event display
        if (states.currentYear in majorWorldEvent){
            majorWorldEventLabel.innerText = majorWorldEvent[states.currentYear][0]['event'] + " in " + states.currentYear;
            playAudio(states.currentYear);
        }
    }
    /*
    
  
    /*
    yearSlider.addEventListener('input', () => {
        onSlidebarChangeEvent();
        yearSlider.addEventListener('change', onSlidebarChangeEvent);
    });
    */
    /*
    yearSlider.addEventListener('change', () => {
        onSlidebarChangeEvent();
        yearSlider.removeEventListener('input', onSlidebarChangeEvent);
    });
    */

    // the play icon and timeline animation
    /*
    const onPlaying = () => {
        if (states.playButtonIsPlaying) {
            if (states.currentYear < yearMax) {
                yearSlider.value = Number(yearSlider.value) + 1;
                onSlidebarChangeEvent();
            } else {
                playButton.click();
            }
        }
    }
    */
    /*
    const onPlayButtonClick = () => {
        states.playButtonIsPlaying = !states.playButtonIsPlaying;
        if (states.playButtonIsPlaying) {
            // update the play icon
            playButtonIcon.className = "";
            playButtonIcon.classList.add('icon-pause');

        } else {
            // update the play icon
            playButtonIcon.className = "";
            playButtonIcon.classList.add('icon-play');
        }
    }
    */

    //playButton.addEventListener('click', () => onPlayButtonClick());
    //setInterval(onPlaying, playRate);

});
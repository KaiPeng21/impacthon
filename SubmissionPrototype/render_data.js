 var data = [{
        type: 'scattergeo',
        mode: 'markers',
        lon: [67.71],
        lat: [33.94, ],
        marker: {
            size: [16, 16],
            color: [10, 10],
            cmin: 0,
            cmax: 50,
            colorscale: 'Greens',
            line: {
              color: 'black'
            }
        },
        name: 'europe data'
    }];
    var frames = [];
    for (let i = 0; i < 6; i++) {
      var yearName = (2010 + i).toString();
      var lonArr = [];
      var latArr = [];
      if (i < 3 || i >=5) {
        latArr.push(33.94);
        lonArr.push(67.71);
      }
      latArr.push(-38.42);
      lonArr.push(-63.62);
      if (i > 3) {
        latArr.push(50.5);
        lonArr.push(4.47);
      }
      frames.push({
        name: yearName,
        data: [
          {
            type: 'scattergeo',
             mode: 'markers',
              lon: lonArr,
              lat: latArr,
              marker: {
                size: [16, 16, 16],
                color: [10, 10, 10],
                 cmin: 0,
                  cmax: 50,
                 colorscale: 'Greens',
                line: {
                  color: 'black'
                }
              }
          }]
      });
    }
    var layout = {
      
        'geo': {
            'scope': 'world',
            'resolution': 110,
            'showcountries': true
        },
        margin: 0,
        height: 800,
       updatemenus: [{
      x: 0.1,
      y: 0,
      yanchor: "top",
      xanchor: "right",
      showactive: false,
      direction: "left",
      type: "buttons",
      pad: {"t": 40, "r": 10},
      buttons: [{
        method: "animate",
        args: [null, {
          fromcurrent: true,
          transition: {
            duration: 200,
          },
          frame: {
            duration: 500,
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
    }],
    sliders: [{
      active: 0,
      steps: [{
        label: "2010",
        method: "animate",
        args: [["2010"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      },{
        label: "2011",
        method: "animate",
        args: [["2011"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }, {
        label: "2012",
        method: "animate",
        args: [["2012"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }, {
        label: "2013",
        method: "animate",
        args: [["2013"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }, {
        label: "2014",
        method: "animate",
        args: [["2014"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }, {
        label: "2015",
        method: "animate",
        args: [["2015"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }, {
        label: "2016",
        method: "animate",
        args: [["2016"], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300, "redraw": false}
          }
        ]
      }],
      x: 0.1,
      len: 0.9,
      xanchor: "left",
      y: 0,
      yanchor: "top",
      pad: {t: 10, b: 10},
      currentvalue: {
        visible: true,
        prefix: "Year:",
        xanchor: "right",
        font: {
          size: 20,
          color: "#666"
        }
      },
      transition: {
        duration: 300,
        easing: "cubic-in-out"
      }
    }]
    };

    Plotly.plot('myDiv', data, layout).then(() => {
      Plotly.addFrames('myDiv', frames);
      
    });
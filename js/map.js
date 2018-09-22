

const unpack = (rows, key) => {
    return rows.map((row) => row[key]);
}

var plotlyData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: [],
    z: 30,
    text: [],
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

    // var country = unpack(rows, 'country');
    // var year = unpack(rows, 'year');
    // var event = unpack(rows, 'event');
    // var lon = unpack(rows, 'lon');
    // var lat = unpack(rows, 'lat');

    Plotly.plot(worldmap, plotlyData, plotlyLayout, {showLink: false});
});





// Plotly.d3.csv('../ref/embassy-data.csv', (err, rows) =>{
    
//     const unpack = (rows, key) => {
//         return rows.map((row) => row[key]);
//     }

//     var country = unpack(rows, 'country');
//     var year = unpack(rows, 'year');
//     var event = unpack(rows, 'event');
//     var lon = unpack(rows, 'lon');
//     var lat = unpack(rows, 'lat');

//     var data = [{
//             type: 'choropleth',
//             locationmode: 'country names',
//             locations: unpack(rows, 'country'),
//             z: unpack(rows, 'lat'),
//             text: unpack(rows, 'country'),
//             autocolorscale: true
//     }];

//     var layout = {
//         title: 'Learning American Diplomacy History',
//         geo: {
//           projection: {
//             type: 'robinson'
//           }
//         }
//     };
//     Plotly.plot(worldmap, data, layout, {showLink: false});
// });

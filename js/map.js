
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

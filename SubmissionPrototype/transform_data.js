const fs = require('fs');
const statusMap = {
    'establish legation': 1,
    'legation exists': 2,
    'establish embassy': 3,
    'embassy exists': 4,
    'elevate to embassy': 5,
    'reopen legation': 6,
    'reopen embassy': 7,
    'closure': 8,
    'closed': 9
};
const mapStatusToCode = ((status) => {

    const calcStatus = statusMap[status];
    // if "established", the status will now be "exists".
    if (calcStatus === 1 || calcStatus === 6) {
        return 2;
    }
    else if (calcStatus === 3 || calcStatus === 5 || calcStatus === 7) {
        return 4;
    }
    else {
        return calcStatus;
    }
});
fs.readFile('raw_data.json', 'utf-8', ((err, data) => {
  if (data) {
    data = JSON.parse(data);
    const transformedData = {};
    const startYear = 1779;
    const endYear = 2018;
    let currYear = startYear;
    const dataByCountry = {};
    data.forEach((dataPoint) => {
        if (!dataByCountry[dataPoint.country]) {
            dataByCountry[dataPoint.country] = {};
            dataByCountry[dataPoint.country].events = [];
            dataByCountry[dataPoint.country].lat = dataPoint.lat;
            dataByCountry[dataPoint.country].lon = dataPoint.lon;
        }
        dataByCountry[dataPoint.country].events.push(
            { 
                type: dataPoint.event,
                year: dataPoint.year
            }
        );
    });
    while (currYear < endYear) {
        const transformedDataObj = []
        Object.keys(dataByCountry).forEach((countryKey) => {
           let eventHappenedInCountry = false;
           let eventType;
           dataByCountry[countryKey].events.forEach((eventInfo, eventKey) => {
              if (eventInfo.year === currYear) {
                 eventHappenedInCountry = true;
                 eventType = dataByCountry[countryKey].events[eventKey].type;
              }
           });
           if (eventHappenedInCountry) {
               if (currYear == 1829) {
                   console.log(dataByCountry[countryKey].currentStatus);
               }
               // set the current status
               dataByCountry[countryKey].currentStatus = eventType;
               transformedDataObj.push({
                   country: countryKey,
                   event: eventType,
                   status: statusMap[eventType],
                   lat: dataByCountry[countryKey].lat,
                   lon: dataByCountry[countryKey].lon,
               });
           }
           else {
               // nothing happened - use the last status for this country.
               if (dataByCountry[countryKey].currentStatus && dataByCountry[countryKey].currentStatus !== 'closure') {
                   // if it's not a closure, it's the same diplomatic relations as last time. no events.
                   // we also skip the listing if this country has not yet had any relations.
                   
                   transformedDataObj.push({
                        country: countryKey,
                        lat: dataByCountry[countryKey].lat,
                        lon: dataByCountry[countryKey].lon,
                        lastAction: dataByCountry[countryKey].currentStatus,
                        status: mapStatusToCode(dataByCountry[countryKey].currentStatus),
                   });
               }
           }
        });

        transformedData[currYear] = transformedDataObj;
        currYear++;
    }
    console.log(JSON.stringify(transformedData['1942'], null, 4));
    console.log(transformedData.length);
    fs.writeFile('transformed_data.json', JSON.stringify(transformedData), 'utf8', ((err, cb) => {
       if (err) {
           console.log('error');
           console.error(err);
       } 
       else {
           console.log('wrote transformed data');
           process.exit();
       }
    }));
  }
}));
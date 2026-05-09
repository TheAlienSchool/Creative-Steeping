const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('c:/Users/Kzaka/Documents/GitHub/SteepingSite/Creative Steeping/steeperverse_delivery/The Mathematics of The Era of Now.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});

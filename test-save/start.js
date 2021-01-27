
const fs = require('fs');
const path = require('path');
const CsvReadableStream = require('csv-reader');


// var test = require('../save/1-single');

// var test = require('../save/2-multiple.1');

// var test = require('../save/3-concurrency.1');

var test = require('../save/4-lock.1');



function load_data() {
  return new Promise((resolve) => {
    var arr = [];
    let inputStream = fs.createReadStream(path.join(__dirname,'./user.csv'), 'utf8');
    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, asObject: true }))
      .on('data', function (row) {
        // console.log('A row arrived: ', row);
        arr.push(row);
      })
      .on('end', function () {
        resolve(arr);
      });
  });
}


(async () => {

  var start_time = new Date();
  console.log(`Start at: ${start_time}`);
  try {
    var data = await load_data();
    await test(data);
  } catch (e) {
    // Deal with the fact the chain failed
    console.log('error', e);
  }

  var end_time = new Date();
  console.log(`End at: ${end_time}`);

  // To calculate the time difference of two dates 
  var difference_in_time = end_time.getTime() - start_time.getTime();

  // To calculate the no. of days between two dates 
  var sec = difference_in_time / (1000);
  console.log(`Total: ${sec} second(s)`);

})();

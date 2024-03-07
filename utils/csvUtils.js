const csvtojson = require('csvtojson');
const fs = require('fs');

module.exports = async function csvToJson(filePath, fileName) {
  const jsonArray = await csvtojson().fromFile(filePath);
  fs.writeFileSync(fileName, JSON.stringify(jsonArray, null, 2));
  console.log('Conversion to JSON complete');
};

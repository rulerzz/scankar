const DataUri = require('datauri/parser');
const path = require('path');

const datauri = new DataUri();

const bufferToString = (originalName, buffer) => {
  const extension = path.extname(originalName);
  return datauri.format(extension, buffer);
};

module.exports = bufferToString;

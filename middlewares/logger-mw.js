const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

module.exports = (type = 'combined', fileName = 'access.log') => {
  const options = {
    size: "10M", // rotate every 10 MegaBytes written
    compress: "gzip", // compress rotated files
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../', 'log')
  }
  const stream = rfs.createStream(fileName, options);
  return morgan(type, { stream }); // (req, res, next) => { ... next();}
}

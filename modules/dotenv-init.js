const path = require('path');
module.exports = () => {
  require('dotenv').config({ path: path.join(__dirname, '../',  '.env.' + process.env.NODE_ENV) });
}
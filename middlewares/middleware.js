const mw1 = (req, res, next) => {
  console.log('mw1');
  next();
}

const mw2 = (str = '') => {
  return (req, res, next) => {
    console.log('mw2 ' + str);
    next();
  }
}

module.exports = { mw1, mw2 }
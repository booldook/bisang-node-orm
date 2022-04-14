const createError = require('http-errors');
const { isLength } = require('validator');

module.exports = async (req, res, next) => {
  try {
    const { userid, userpw } = req.body;
    const lengthOptions = { min: 6, max: 24 }
    const validArray = [];

    validArray.push(isLength(userid.trim(), lengthOptions));
    validArray.push(isLength(userpw.trim(), lengthOptions));

    if(validArray.every(v => v)) {
      next();
    }
    else {
      next(createError(400, 'Invalid Parameters'))
    }
  }
  catch(err) {
    next(createError(500, err));
  }
}

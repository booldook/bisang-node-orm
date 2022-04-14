const createError = require('http-errors');
const { isEmail, isLength } = require('validator');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    const { BCRYPT_SALT, BCRYPT_ROUND } = process.env;
    const { userid, userpw, username, email } = req.body;
    const lengthOptions = { min: 6, max: 24 }
    const validArray = [];

    validArray.push(isLength(userid.trim(), lengthOptions));
    validArray.push(isLength(userpw.trim(), lengthOptions));
    validArray.push(isEmail(email.trim()));

    if(validArray.every(v => v)) {
      req.body.userpw = await bcrypt.hash(userpw.trim() + BCRYPT_SALT, Number(BCRYPT_ROUND));
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

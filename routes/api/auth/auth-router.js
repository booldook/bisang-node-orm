const path = require('path');
const express = require('express');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const router = express.Router();
const { alert } = require('../../../modules/utils');
const { User } = require('../../../models');
const loginValidator = require('../../../middlewares/login-mw');
const { isGuest, isUser } = require('../../../middlewares/auth-mw');


// 로그인처리
router.post('/', isGuest, loginValidator, async (req, res, next) => {
  try {
    const { userid, userpw } = req.body;
    const { BCRYPT_SALT } = process.env;
    const user = await User.findOne({ where: { userid: req.body.userid }, raw: true });
    if(user) {
      const compare = await bcrypt.compare(userpw + BCRYPT_SALT, user.userpw);
      if(compare) {
        req.session.user = {
          idx: user.idx,
          userid: user.userid,
          username: user.username,
          email: user.email,
          grade: user.grade,
        }
        res.status(200).json({ success: true, user: req.session.user });
      }
      else {
        res.status(401).json({ success: true, err: '아이디와 패스워드를 확인하세요.' });
      }
    }
    else {
      res.status(401).json({ success: true, err: '아이디와 패스워드를 확인하세요.' });
    }
  } 
  catch (err) {
    next(createError(500, err));
  }
});

// 로그아웃처리
router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.locals.user = {};
    res.status(200).send(alert('로그아웃 되었습니다.','/'));
  });
});

module.exports = router;
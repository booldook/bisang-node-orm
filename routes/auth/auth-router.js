const path = require('path');
const express = require('express');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const router = express.Router();
const { alert } = require('../../modules/utils');
const { pool } = require('../../modules/mysql-init');
const loginValidator = require('../../middlewares/login-mw');

// 회원로그인창
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

// 로그인처리
router.post('/', loginValidator, async (req, res, next) => {
  try {
    const { userid, userpw } = req.body;
    const { BCRYPT_SALT } = process.env;
    const sqlUser = 'SELECT * FROM users WHERE userid=?';
    const [rs] = await pool.execute(sqlUser, [userid]);
    if(rs.length) {
      const compare = await bcrypt.compare(userpw + BCRYPT_SALT, rs[0].userpw);
      if(compare) {
        req.session.user = {
          idx: rs[0].idx,
          userid: rs[0].userid,
          username: rs[0].username,
          email: rs[0].email,
          grade: rs[0].grade,
        }
        res.redirect('/');
      }
      else res.status(200).send(alert('아이디와 패스워드를 확인하세요.', '/auth'));
    }
    else {
      res.status(200).send(alert('아이디와 패스워드를 확인하세요.', '/auth'));
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
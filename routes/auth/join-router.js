const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { alert } = require('../../modules/utils');
const { isUser, isGuest } = require('../../middlewares/auth-mw');
const { pool } = require('../../modules/mysql-init');
const joinValidator = require('../../middlewares/join-mw');
const moment = require('moment');

// 회원가입
router.get('/', isGuest, (req, res, next) => {
  res.render('auth/join')
});

// 회원저장
router.post('/', isGuest, joinValidator, async (req, res, next) => {
  try {
    const { userid, userpw, username, email } = req.body;
    const sql = 'INSERT INTO users SET userid=?, userpw=?, username=?, email=?';
    const values = [userid, userpw, username, email];
    const [{ affectedRows: rs }] = await pool.execute(sql, values);
    if(rs) res.send(alert('회원가입이 완료되었습니다.'));
    else next(createError(500, '저장이 안됐어요~'));
  } 
  catch (err) {
    next(createError(500, err))
  }
});

module.exports = router;
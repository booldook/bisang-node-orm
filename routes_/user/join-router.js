const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { alert } = require('../../modules/utils');
const { pool } = require('../../modules/mysql-init');
const { User } = require('../../models');
const bcrypt = require('bcrypt');

router.get('/', async (req, res, next) => {
  res.render('auth/join');
});

router.post('/', async (req, res, next) => {
  try {
    const pass = await bcrypt.hash(req.body.userpw + process.env.BCRYPT_SALT, Number(process.env.BCRYPT_ROUND))
    const user = await User.create({
      userid: req.body.userid,
      userpw: pass,
      username: req.body.username,
      nickname: req.body.username,
      email: req.body.email,
    });
    res.json(user)
  }
  catch(err) {
    next(createError(err));
  }
});

module.exports = router;
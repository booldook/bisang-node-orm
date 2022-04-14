const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { alert } = require('../../modules/utils');
const { pool } = require('../../modules/mysql-init');
const { User } = require('../../models');

router.get('/', async (req, res, next) => {
  res.render('auth/join');
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({
      userid: req.body.userid,
      userpw: req.body.userpw,
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
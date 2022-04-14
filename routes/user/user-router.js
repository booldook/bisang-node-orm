const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { alert } = require('../../modules/utils');
const { pool } = require('../../modules/mysql-init');
const { User } = require('../../models');

router.get(['/', '/:idx'], async (req, res, next) => {
  const obj = {}
  if(req.params.idx) obj.where = { idx: req.params.idx };
  const users = await User.findAll(obj);
  res.json(users);
});

router.get('/remove/:idx', async (req, res, next) => {
  const rs = await User.destroy({ where: { idx: req.params.idx } });
  res.json(rs);
});

router.get('/update/:idx', async (req, res, next) => {
  const updateUser = {
    username: req.query.name
  };
  const rs = await User.update(updateUser, { where: { idx: req.params.idx } });
  res.json(rs);
});



module.exports = router;
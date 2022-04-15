const express = require('express');
const router = express.Router();

const createRouter = require('./create');
const listRouter = require('./list');
const viewRouter = require('./view');

router.use('/create', createRouter);
router.use('/list', listRouter);
router.use('/view', viewRouter);

module.exports = router;

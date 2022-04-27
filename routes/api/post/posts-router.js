const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const moment = require('moment');
const { Post, File } = require('../../../models')
const logger = require('../../../middlewares/logger-mw');
const { isUser } = require('../../../middlewares/auth-mw');
const pagerFn = require('../../../modules/pager-init');
const { imgPath } = require('../../../modules/utils');

router.get(['/', '/:page'], logger('common', 'access-posts.log'), async (req, res, next) => {
  try {
    const post = await Post.findAll({ attributes: ['idx'], raw: true });
    const cnt = post.length;
    const pager = pagerFn(req.params.page || 1, cnt, 3, 3);
    const posts = await Post.findAll({ 
      limit: pager.listCnt, 
      offset: pager.startIdx, 
      raw: true, 
      nest: true, 
      include: { 
        model: File,
        attributes: ['idx', 'savename'],
      } 
    });
    res.status(200).json({ posts: Post.getPosts(posts), pager });
    // res.status(200).render('post/list', { title: 'TITLE', posts: Post.getPosts(posts), ...pager })
  }
  catch(err) {
    next(createError(500, err))
  }
})

module.exports = router;
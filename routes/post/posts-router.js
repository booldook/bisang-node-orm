const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const moment = require('moment');
const { Post, File } = require('../../models')
const logger = require('../../middlewares/logger-mw');
const { isUser } = require('../../middlewares/auth-mw');
const pagerFn = require('../../modules/pager-init');
const { imgPath } = require('../../modules/utils');

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
    // res.json(Post.getPosts(posts));
    res.status(200).render('post/list', { title: 'TITLE', posts: Post.getPosts(posts), ...pager })

    /* const pagerSql = 'SELECT count(idx) AS cnt FROM posts';
    const [[{ cnt }]] = await pool.execute(pagerSql);
    const pager = pagerFn(req.params.page || 1, cnt, 3, 3);
    const listSql = `
      SELECT p.*, f.idx AS f_idx, f.savename 
      FROM posts AS p LEFT JOIN files AS f
        ON p.idx = f.post_idx
      ORDER BY p.idx DESC LIMIT ?, ?`;
    const [rs] = await pool.execute(listSql, [ pager.startIdx, pager.listCnt ]);
    const posts = rs.map(v => {
      v.wdate = moment(v.wdate).format('YYYY-MM-DD');
      v.src = v.savename ? imgPath(v.savename) : '/img/gallery.png';
      return v;
    });
    res.status(200).render('post/list', { title: 'TITLE', posts, ...pager }) */
  }
  catch(err) {
    next(createError(500, err))
  }
})

module.exports = router;
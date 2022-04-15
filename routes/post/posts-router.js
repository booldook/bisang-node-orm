const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const moment = require('moment');

const { pool } = require('../../modules/mysql-init');
const logger = require('../../middlewares/logger-mw');
const { isUser } = require('../../middlewares/auth-mw');
const pagerFn = require('../../modules/pager-init');
const { imgPath } = require('../../modules/utils');

router.get(['/', '/:page'], logger('common', 'access-posts.log'), async (req, res, next) => {
  try {
    // const startIdx = ((Number(req.params.page) || 1) - 1) * 2;
    // const sql = 'SELECT * FROM post ORDER BY idx DESC LIMIT ?, 2';
    // const [rs] = await pool.execute(sql, [startIdx]);
    // const posts = rs.map((v) => {
    //   v.wdate = moment(v.wdate).format('YYYY-MM-DD');
    //   return v;
    // })
    // res.json(rs);
    // res.render('post/list', { title: req.myName, posts  })
    const pagerSql = 'SELECT count(idx) AS cnt FROM posts';
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
    // res.json(rs);
    res.status(200).render('post/list', { title: 'TITLE', posts, ...pager })
  }
  catch(err) {
    next(createError(500, err))
  }
})

module.exports = router;
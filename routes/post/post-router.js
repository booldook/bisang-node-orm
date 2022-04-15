/* 
semantic ULR
[GET]    /posts, /posts/1(page)  - 게시글 리스트
[GET]    /post                   - 게시글 등록
[GET]    /post/1                 - 게시글 상세
[GET]    /post/1/update          - 게시글 수정
[POST]   /post                   - 게시글 신규 저장
[POST]   /post/1                 - 게시글 수정 저장
[DELETE] /post/1                 - 게시글 삭제
*/

const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const moment = require('moment');
const { pool } = require('../../modules/mysql-init');
const { isAdmin, isUser, isMine } = require('../../middlewares/auth-mw');
const { getIsoDate, alert, imgPath, imgPathAbs } = require('../../modules/utils')
const { pathExists } = require('fs-extra');

// const multer  = require('multer');
// const uploader = multer({ dest: path.join(__dirname, '../../', '/storages') })
const uploader = require('../../middlewares/multer-mw');


router.get('/', isUser, (req, res, next) => {
  res.render('post/form');
});

router.post('/', isUser, uploader.single('upfile'), async (req, res, next) => {
  try {
    if(req.multerFilter) {
      res.send(alert('업로드 할 수 없는 파일입니다.', '/post'));
    }
    const { title, writer, content } = req.body;
    const postSql = 'INSERT INTO posts SET title=?, writer=?, content=?, user_idx=?';
    const postValues = [title, writer, content, req.session.user.idx ];
    const [{ insertId }] = await pool.execute(postSql, postValues);
    if(req.file) {
      const { originalname, filename, size } = req.file;
      const fileSql = 'INSERT INTO files SET oriname=?, savename=?, filesize=?, post_idx=?';
      const fileValues = [originalname, filename, size, insertId];
      const [rs] = await pool.execute(fileSql, fileValues);
    }
    res.redirect('/posts');
  }
  catch(err) {
    next(createError(500, err))
  }
});

router.get('/:idx', async (req, res, next) => {
  try {
    // 여기를 구현
    const sql = `
    SELECT p.*, f.idx AS f_idx, f.oriname, f.savename 
    FROM posts AS p LEFT JOIN files AS f 
      ON p.idx = f.post_idx
    WHERE p.idx=?`;
    const [[rs]] = await pool.execute(sql, [req.params.idx]);
    // res.json(rs);
    rs.wdate = getIsoDate(rs.wdate);
    rs.src = rs.savename ? imgPath(rs.savename) : '';
    res.render('post/view', { ...rs });
    // res.json(rs);
  }
  catch(err) {
    next(createError(500, err))
  }
});

router.get('/download/:idx', async (req, res, next) => {  // 다운로드 구현
  try {
    const sql = 'SELECT oriname, savename FROM files WHERE idx=?';
    const [rs] = await pool.execute(sql, [req.params.idx]);
    if(rs.length) {
      const { savename, oriname } = rs[0];
      // res.json({ oriname, savename });
      res.download(imgPathAbs(savename), oriname);
    }
    else next(createError(403, '잘못된 접근입니다.'))
  }
  catch (err) {
    next(createError(500, err))
  }
});

router.delete('/', isMine('DELETE'), async (req, res, next) => {
  try {
    const fileSql = 'SELECT savename FROM files WHERE post_idx=?';
    const [rs] = await pool.execute(fileSql, [req.body.idx]);
    if(rs.length && rs[0].savename) {
      await fs.remove(imgPathAbs(rs[0].savename));
    }
    const removeSql = 'DELETE FROM posts WHERE idx=?';
    const [rs2] = await pool.execute(removeSql, [req.body.idx]);
    res.redirect('/');
  }
  catch(err) {
    next(createError(500, err))
  }
})


router.get('/:idx/update', (req, res, next) => {
  res.send('게시글수정');
})

router.post('/', (req, res, next) => {
  res.send('게시글신규저장');
})

router.put('/:idx', (req, res, next) => {
  res.send('게시글수정저장');
})

module.exports = router;
const createError = require('http-errors');
const { pool } = require('../modules/mysql-init');

const isUser = (req, res, next) => {
  if(req.session && req.session.user && req.session.user.grade >= 1) next();
  else next(createError(401, '인증되지 않았습니다.'))
}

const isAdmin = (req, res, next) => {
if(req.session && req.session.user && req.session.user.grade >= 2) next();
  else next(createError(401, '인증되지 않았습니다.'))
}

const isGuest = (req, res, next) => {
  if(req.session && req.session.user && req.session.user.idx) next(createError(401, '회원은 접근할 수 없습니다.'))
  else next()
}

const isMine = (_mode) => {
  return async (req, res, next) => {
    try {
      if(_mode === 'DELETE' && req.body && req.body.idx) {
        if(req.session && req.session.user && req.session.user.idx) {
          const userIdx = req.session.user.idx;
          const postSql = 'SELECT user_idx FROM posts WHERE idx=?'
          const [[{ user_idx }]] = await pool.execute(postSql, [req.body.idx])
          if(userIdx === user_idx) next();
          else next(createError(400, '잘못된 ...'))
        }
        else next(createError(400, '잘못된 ...'))
      }
      else if(_mode === 'UPDATE') {
        next();
      }
      else next(createError(400, '잘못된 ...'))
    }
    catch (err) {
      next(createError(500, err));
    }
  }
}

module.exports = { isUser, isAdmin, isGuest, isMine }
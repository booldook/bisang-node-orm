const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { pool } = require('../modules/mysql-init');
const { v4: uuidv4 } = require('uuid');

const options = {
  name: 'Bisang',
  secret: process.env.SESSION_SALT,
  resave: false, // 접속할때 마다 갱신(true)
  saveUninitialized: true,
  genid: () => uuidv4(), // id 생성, 안쓰면 알아서 index로 들어간다.
  cookie: {
    secure: false,  // true: https에서만 사용 가능
    httpOnly: true, // true: javascript는 cookie 접근 불가
  },
  store: new MySQLStore({ expiration: 1000 * 60 * 60 * 2 }, pool),
};

const expressSession = session(options);

module.exports = (app) => {
  app.set('trust proxy', 1);
  return expressSession;
}
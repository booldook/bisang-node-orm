/* global */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.' + process.env.NODE_ENV) });

const express = require('express');
const app = express();

const { sequelize } = require('./models')

const logger = require('./middlewares/logger-mw');
const expressSession = require('./middlewares/session-mw');
const local = require('./middlewares/local-mw');
const methodOverride = require('./middlewares/method-mw');

const notFoundRouter = require('./routes/error/err404-router');
const errorRouter = require('./routes/error/err-router');
const userRouter = require('./routes/user/user-router');

/* server init */
app.listen(process.env.PORT, () => console.log('Server Running : http://127.0.0.1:' + process.env.PORT));

/* sequelize init */
sequelize.sync({  });

/* middleware init */
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: false })); // req.body

/* session init */
app.use(expressSession(app));

/* method-override */
app.use(methodOverride);

/* locals 에 session 정보 전달 */
app.use(local);

/* logger */
app.use(logger('tiny', 'access-all.log'));

/* static router */
app.use('/', express.static(path.join(__dirname, 'public'))); // html, css, js, images/movie/audio
app.use('/uploads', express.static(path.join(__dirname, 'storages'))); // html, css, js, images/movie/audio

/* logger */
app.use(logger());

/* view init */
app.set('view engine', 'ejs');
app.set('views', './views');
app.locals.pretty = true;
app.locals.headTitle = '비상교육-nodejs';

/* dynamic router init */
app.use('/user', userRouter);

/* error router init */
app.use(notFoundRouter);
app.use(errorRouter);
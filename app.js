/* global import */
require('./modules/dotenv-init')();
const path = require('path');
const express = require('express');
const app = express();

/* model import */
const { sequelize } = require('./models');

/* middleware import */
const logger = require('./middlewares/logger-mw');
const expressSession = require('./middlewares/session-mw');
const local = require('./middlewares/local-mw');
const methodOverride = require('./middlewares/method-mw');

/* router import */
const postsRouter = require('./routes/post/posts-router');
const postRouter = require('./routes/post/post-router');
const joinRouter = require('./routes/auth/join-router');
const authRouter = require('./routes/auth/auth-router');
const notFoundRouter = require('./routes/error/err404-router');
const errorRouter = require('./routes/error/err-router');

/* server init */
app.listen(process.env.PORT, () => console.log('Server Running : http://127.0.0.1:' + process.env.PORT));

/* view init */
app.set('view engine', 'ejs');
app.set('views', './views');
app.locals.pretty = true;
app.locals.headTitle = '비상교육-nodejs';

/* sequelize init */
sequelize.sync({ force: true });

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

/* dynamic router init */
app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/join', joinRouter);
app.use('/auth', authRouter);

/* error router init */
app.use(notFoundRouter);
app.use(errorRouter);
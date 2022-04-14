// /storages/2022/04/11/20220411-uuid.jpg
// import { v4 as uuidv4 } from 'uuid'; // ES6
const { v4: uuidv4 } = require('uuid'); // CommonJS
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const moment = require('moment');
const createError = require('http-errors');
const { allowFileExt, allowImageExt, STORE, getExt } = require('../modules/utils');
const mega = 1024000;



/* Storage */
const destination = async (req, file, cb) => {
  try {
    const folder = path.join(__dirname, '../', STORE, moment().format('YYYY'), moment().format('MM'), moment().format('DD'));
    await fs.ensureDir(folder)
    cb(null, folder)
  }
  catch (err) {
    cb(err)
  }
}

const filename = async (req, file, cb) => {
  try {
    // const ext = path.extname(file.originalname).toLowerCase().replace('.', '') 
    const ext = getExt(file.originalname);
    const filename = moment().format('YYYY-MM-DD') + '_' + uuidv4() + '.' + ext;
    cb(null, filename);
  }
  catch(err) {
    cb(err);  // next(new Error(err))
  }
}

const fileFilter = (req, file, cb) => {
  try {
    const ext = getExt(file.originalname);
    const allow = allowImageExt.includes(ext);
    if (allow) cb(null, true);
    else {
      req.multerFilter = 'denied';
      cb(null, false);
    }
    // else cb(new Error('업로드 할 수 없는 파일입니다.'));
  }
  catch(err) {
    cb(err)
  }
}

const limits = mega * 5;

const storage = multer.diskStorage({ destination, filename })

module.exports =  multer({ storage, limits, fileFilter })
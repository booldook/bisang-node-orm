const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');
const config = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
}
const db = {};
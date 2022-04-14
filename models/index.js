const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');
const config = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
}
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// 테이블 관계 설정
Object.keys(db).forEach(modelName => {
  if(db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db { User, Post, sequelize, Sequelize }

module.exports = db;

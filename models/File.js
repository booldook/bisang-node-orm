const { getIsoDate, alert, imgPath, imgPathAbs } = require('../modules/utils')

module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define('File', {
    idx: {
      type: Sequelize.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    oriname: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    savename: {
      type: Sequelize.STRING(255),
      allowNull: false,
      /* get() {
        console.log(this.getDataValue('savename'));
        return imgPath(this.getDataValue('savename'))
      } */
    },
    filesize: {
      type: Sequelize.INTEGER(10),
      allowNull: false,
    },
  }, {
    tableName: 'files',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    paranoid: true,
  });

  File.associate = (models) => {
    File.belongsTo(models.Post, {
      foreignKey: {
        name: 'post_idx',
        allowNull: false,
      },
      sourceKey: 'idx',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  }

  return File;
}
module.exports = (sequelize, Sequelize) => {
  // return sequelize.define('객체명', 필드정보, 테이블정보)
  const User = sequelize.define('User', {
    idx: {
      type: Sequelize.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userid: {
      type: Sequelize.STRING(24),
      allowNull: false,
      unique: true,
    },
    userpw: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    nickname: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    paranoid: true,
  });

  // hasOne, hasMany, belongsTo, belongsToMany
  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: {
        name: 'user_idx',
        allowNull: false,
      },
      sourceKey: 'idx',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  }

  return User;
}
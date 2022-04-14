module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('Post', {
    idx: {
      type: Sequelize.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    writer: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'posts',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    paranoid: true,
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: 'user_idx',
        allowNull: false,
      },
      sourceKey: 'idx',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  }

  return Post;
}
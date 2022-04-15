const { getIsoDate, alert, imgPath, imgPathAbs } = require('../modules/utils')

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
    });
    Post.hasMany(models.File, {
      foreignKey: {
        name: 'post_idx',
        allowNull: false,
      },
      sourceKey: 'idx',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
  }

  Post.getPost = post => {
    post.wdate = getIsoDate(post.createdAt);
    if(post.Files && post.Files.savename) {
      post.src = imgPath(post.Files.savename);
      post.oriname = post.Files.oriname || '';
      post.f_idx = post.Files.idx;
    }
    return post;
  }

  Post.getPosts = posts => posts.map(post => Post.getPost(post));
  
  return Post;
}
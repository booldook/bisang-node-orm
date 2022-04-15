module.exports = {
  up: async (queryInterface, Sequelize) => { // execute
    await queryInterface.addColumn('users', 'nickname', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('users', 'addr', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: '',
    });
  },
  down: async (queryInterface, Sequelize) => { // undo
    await queryInterface.removeColumn('users', 'nickname');
    await queryInterface.removeColumn('users', 'addr');
  }
}
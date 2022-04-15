const bcrypt = require('bcrypt');
const { BCRYPT_SALT, BCRYPT_ROUND } = process.env;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for(let i =0; i<10; i++) {
      users.push({
        userid: 'testee' + i,
        username: 'test user' + i,
        userpw: await bcrypt.hash('111111' + BCRYPT_SALT, Number(BCRYPT_ROUND)),
        email: 'booldook@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log(users);
    await queryInterface.bulkInsert('users', users);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}
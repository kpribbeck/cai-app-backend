'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const usersData = [
      {
        user_name: 'user_name',
        password: '1234',
        name: 'Rodrigo',
        last_name: 'Rodriguez',
        mail: "rodrigo@rodriguez.cl",
        student_id: '1234567J',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    return queryInterface.bulkInsert('users', usersData);
  },


  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};

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
    const objectsData = [
      {
        name: 'This is my first test object',
        description: 'This object is very interesting... :)',
        stock: 1,
        picture: 'www.objectimg.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    return queryInterface.bulkInsert('objects', objectsData);
  },


  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};

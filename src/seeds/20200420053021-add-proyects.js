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
    const proyectsData = [
      {
        name: 'This is my first test proyect',
        description: 'This proyect is very interesting... :)',
        contact: 'cai@uc.cl',
        picture: 'www.proyectimg.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    return queryInterface.bulkInsert('proyects', proyectsData);
  },


  down: (queryInterface) => queryInterface.bulkDelete('proyects', null, {}),
};

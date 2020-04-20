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
    const eventsData = [
      {
        title: 'This is my first test event',
        description: 'This story is very interesting... :)',
        organizer: 'webros',
        place: 'Cai',
        category: 'carrete',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'This is my second test event',
        description: 'This event is not very interesting... :)',
        organizer: 'Cai',
        place: 'La Y',
        category: 'misa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('events', eventsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('events', null, {}),
};

'use strict';

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const storiesData = [
      {
        title: 'This is my first test story',
        body: 'This story is very interesting... :)',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'This is another awesome story',
        body: 'This story is even better than the last one... :)!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Great story',
        body: 'Wow... this was Great!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('stories', storiesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('stories', null, {}),
};

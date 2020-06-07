"use strict";

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
    const messagesData = [
      {
        content: "hola",
        user1: 9,
        user2: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "holaa, como estas",
        user1: 10,
        user2: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: "bien y tu",
        user1: 9,
        user2: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert("messages", messagesData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};

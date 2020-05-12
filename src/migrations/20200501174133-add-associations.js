'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // User has many Stories
    return queryInterface.addColumn(
      'stories',
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
    .then(() => {
      // User has many events
      return queryInterface.addColumn(
        'events',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      );
    })
    .then(() => {
      // Proyect belongs to User
      return queryInterface.addColumn(
        'proyects',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      );
    })
    .then(() => {
      // lostAndFound belongsTo User
      return queryInterface.addColumn(
        'lost_n_founds',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      );
    })
    .then(() => {
      // object belongsTo User
      return queryInterface.addColumn(
        'objects',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'stories',
      'userId'
    )
    .then(() => {
      return queryInterface.removeColumn(
        'events',
        'userId'
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
        'proyects',
        'userId'
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
        'lost_n_founds',
        'userId'
      );
    })
    .then(() => {
      return queryInterface.removeColumn(
        'objects',
        'userId'
      );
    });
  }
};

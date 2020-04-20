'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    organizer: DataTypes.STRING,
    place: DataTypes.STRING,
    category: DataTypes.STRING
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};
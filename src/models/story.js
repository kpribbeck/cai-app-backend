'use strict';
module.exports = (sequelize, DataTypes) => {
  const story = sequelize.define('story', {
    title: DataTypes.STRING,
    body: DataTypes.STRING
  }, {});
  story.associate = function(models) {
    // associations can be defined here
  };
  return story;
};
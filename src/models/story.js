'use strict';
module.exports = (sequelize, DataTypes) => {
  const story = sequelize.define('story', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        notEmpty: true
      }
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {});
  story.associate = function(models) {
    // associations can be defined here
    story.belongsTo(models.user);
  };
  return story;
};
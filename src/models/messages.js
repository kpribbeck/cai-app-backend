"use strict";
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    "message",
    {
      content: DataTypes.STRING,
      user1: DataTypes.INTEGER,
      user2: DataTypes.INTEGER,
    },
    {}
  );
  message.associate = function (models) {
    // associations can be defined here
  };
  return message;
};

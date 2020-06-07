"use strict";
module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define(
    "object",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: DataTypes.STRING,
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      picture: DataTypes.STRING,
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  object.associate = function (models) {
    // associations can be defined here
    object.belongsTo(models.user);
  };
  return object;
};

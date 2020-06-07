"use strict";
module.exports = (sequelize, DataTypes) => {
  const lost_n_found = sequelize.define(
    "lost_n_found",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: DataTypes.STRING,
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      pickedUp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      pickedBy_name: {
        type: DataTypes.STRING,
      },
      pickedBy_mail: {
        type: DataTypes.STRING,
      },
      pickedBy_phone: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  lost_n_found.associate = function (models) {
    // associations can be defined here
    lost_n_found.belongsTo(models.user);
  };
  return lost_n_found;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const proyect = sequelize.define('proyect', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    picture: DataTypes.STRING
  }, {});
  proyect.associate = function(models) {
    // associations can be defined here
    proyect.belongsTo(models.user);
  };
  return proyect;
};
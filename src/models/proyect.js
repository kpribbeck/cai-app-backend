'use strict';
module.exports = (sequelize, DataTypes) => {
  const proyect = sequelize.define('proyect', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    contact: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {});
  proyect.associate = function(models) {
    // associations can be defined here
  };
  return proyect;
};
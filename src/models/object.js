'use strict';
module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    picture: DataTypes.STRING
  }, {});
  object.associate = function(models) {
    // associations can be defined here
  };
  return object;
};
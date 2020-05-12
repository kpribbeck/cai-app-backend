'use strict';
module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  object.associate = function(models) {
    // associations can be defined here
    object.belongsTo(models.user);
  };
  return object;
};
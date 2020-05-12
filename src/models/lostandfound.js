'use strict';
module.exports = (sequelize, DataTypes) => {
  const lost_n_found = sequelize.define('lost_n_found', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    picture: DataTypes.BLOB,
    pickedBy_name: DataTypes.STRING,
    pickedBy_mail: DataTypes.STRING,
    pickedBy_phone: DataTypes.STRING
  }, {});
  lost_n_found.associate = function(models) {
    // associations can be defined here
    lost_n_found.belongsTo(models.user);
  };
  return lost_n_found;
};
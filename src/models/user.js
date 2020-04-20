'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    mail: DataTypes.STRING,
    student_id: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
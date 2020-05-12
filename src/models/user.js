'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    student_number: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    picture: DataTypes.BLOB,
    job: DataTypes.STRING,
    is_admin: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.story);

    user.hasMany(models.event);

    user.hasMany(models.proyect);

    user.hasMany(models.lost_n_found);

    user.hasMany(models.object);
  };
  return user;
};
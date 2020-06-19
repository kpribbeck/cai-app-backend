'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    student_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    contact_number: DataTypes.STRING,
    picture: DataTypes.STRING,
    job: DataTypes.STRING,
    is_admin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
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
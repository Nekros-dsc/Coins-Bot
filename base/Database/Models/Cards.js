const { DataTypes } = require('sequelize');
const { GuildsInstance } = require("../database");

const Cards = GuildsInstance.define('Cards', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  guildId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  avatar: {
    type: DataTypes.STRING
  },
  attaque: {
    type: DataTypes.INTEGER
  },
  defense: {
    type: DataTypes.INTEGER
  },
  vie: {
    type: DataTypes.INTEGER
  },
  proprio: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = {
  Cards
};


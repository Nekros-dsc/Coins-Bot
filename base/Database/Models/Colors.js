// models/color.js
const { DataTypes } = require('sequelize');
const { GuildsInstance } = require("../database");

const Color = GuildsInstance.define('Color', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = {
    Color
};



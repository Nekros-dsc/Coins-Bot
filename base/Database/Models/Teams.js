const { DataTypes } = require('sequelize');
const { GuildsInstance } = require("../database");

const Teams = GuildsInstance.define('Teams', {
    primary: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guildId: {
        type: DataTypes.STRING(65),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cadenas: {
        type: DataTypes.STRING,
        defaultValue: 5
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coins: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    rep: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    army: {
        type: DataTypes.STRING,
        defaultValue: 10
    },
    blesses: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    trainlevel: {
        type: DataTypes.STRING,
        defaultValue: 1
    },
    Upgrade: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    members: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    banner: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = {
    Teams
};



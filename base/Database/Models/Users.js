const sequelize = require("sequelize");
const { GuildsInstance } = require("../database");

const Users = GuildsInstance.define('Users', {
    primary: {
		type: sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
    UserId: {
        type: sequelize.STRING(65),
        allowNull: false,
    },
    GuildId: {
        type: sequelize.STRING(65),
        allowNull: false
    },
    Coins: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    Bank: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    Rep: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    Drugs: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    Entrepot: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    XP: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    level: {
        type: sequelize.STRING,
        defaultValue: 1
    },
    Card: {
        type: sequelize.STRING(65),
        allowNull: true,
    },
    Victoires: {
        type: sequelize.STRING,
        defaultValue: 0
    },
    Minerais: {
        type: sequelize.JSON,
        allowNull: true
    },
    Batiments: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Color: {
        type: sequelize.STRING(65),
        allowNull: true
    },
    Cooldown: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Capacite: {
        type: sequelize.STRING(65),
        allowNull: true,
    },
    Metier: {
        type: sequelize.STRING(65),
        allowNull: true,
    },
    Vocal: {
        type: sequelize.BOOLEAN,
        defaultValue: true,
    },
    ThreeMinutes: {
        type: sequelize.STRING,
        defaultValue: 0,
    },
});


module.exports = {
    Users
};


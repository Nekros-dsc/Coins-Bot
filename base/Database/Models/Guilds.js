const sequelize = require("sequelize");
const { GuildsInstance } = require("../database");

const Guilds = GuildsInstance.define('Guilds', {
    guildId: {
        type: sequelize.STRING(65),
        allowNull: false,
        primaryKey: true
    },
    Prefix: {
        type: sequelize.STRING,
        allowNull: false,
    },
    Add: {
        type: sequelize.BOOLEAN,
        defaultValue: false,
    },
    Remove: {
        type: sequelize.BOOLEAN,
        defaultValue: false,
    },
    Reset: {
        type: sequelize.BOOLEAN,
        defaultValue: false,
    },
    Color: {
        type: sequelize.STRING(65),
        defaultValue: "F4D80B"
    },
    DrugPrice: {
        type: sequelize.STRING,
        defaultValue: 1000
    },
    cshop: {
        type: sequelize.JSON,
        defaultValue: {}
    },
    FarmChannels: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Cooldowns: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Gains: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Logs: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Prices: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    Max: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    XP: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    EnchereConfig: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    PlayChannels: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: {}
    },
    APIkey: {
        type: sequelize.STRING(65),
        allowNull: true
    }
});


module.exports = {
    Guilds
};


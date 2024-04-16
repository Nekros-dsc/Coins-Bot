const { DataTypes } = require('sequelize');
const { GuildsInstance } = require("../database");

const Encheres = GuildsInstance.define('Encheres', {
    id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
    },
    guildId: {
        type: DataTypes.STRING(65),
        allowNull: false
    },
    ChannelId: {
        type: DataTypes.STRING(65),
        allowNull: false
    },
    MessageId: {
        type: DataTypes.STRING(65),
        allowNull: false
    },
    prize: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    click: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastenchere: {
        type: DataTypes.STRING,
        allowNull: false
    },
    encherisseur: {
        type: DataTypes.STRING,
        allowNull: true
    },
    datestart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Encheres.beforeCreate((encheres, options) => {
    encheres.lastenchere = encheres.click;
});


module.exports = {
    Encheres
};



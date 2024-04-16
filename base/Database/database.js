const sequelize = require("sequelize");

const BotsInstance = new sequelize.Sequelize({
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  //password: "AWJzuR7QDbY4Lx5q",
  database: "managerCoins",
  logging: false,
  define: {
      timestamps: false
  }
});

const GuildsInstance = new sequelize.Sequelize({
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  //password: "AWJzuR7QDbY4Lx5q",
  database: "coinsbotLevrai",
  logging: false,
  define: {
      timestamps: false
  }
});

module.exports = { BotsInstance, GuildsInstance };
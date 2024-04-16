
const { Bots } = require("./Models/Bots");
const { Guilds } = require("./Models/Guilds");
const { Users } = require("./Models/Users");
const { Color } = require("./Models/Colors");
const { Teams } = require("./Models/Teams");
const { Encheres } = require("./Models/Encheres");
const {Cards} = require("./Models/Cards");

module.exports = async () => {
    Bots.sync();
    Users.sync()
    Guilds.sync()
    Color.sync()
    Teams.sync()
    Encheres.sync()
    Cards.sync()
    console.log("La base de donnée est bien connectée !");
}


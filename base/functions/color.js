const { Users } = require("../Database/Models/Users");
const { Guilds } = require("../Database/Models/Guilds");
const getUser = require("./getUser");
const checkGuild = require("./checkGuild");

module.exports = async (UserId, GuildId, client, userColor = true) => {
    if(userColor){
    let user = await Users.findOne({ where: { UserId, GuildId } });
    if (!user) user = await getUser(UserId, GuildId)
    if (user.dataValues.Color) return `#`+user.dataValues.Color}

    let guild = await Guilds.findOne({ where: { GuildId } });
    if (!guild) guild = checkGuild(client.user.id, UserId)
    return `#`+guild.dataValues.Color;

};

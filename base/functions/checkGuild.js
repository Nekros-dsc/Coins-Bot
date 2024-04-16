const { Bots } = require("../Database/Models/Bots")
const { Guilds } = require("../Database/Models/Guilds")

module.exports = async (ClientId, guildId) => {
    let user = await Guilds.findOne({ where: { guildId: guildId } });
    if (!user && ClientId) {
        let data = await Bots.findOne({ where: { botid: ClientId } })
        return await Guilds.create({
            guildId: guildId,
            Prefix: data.dataValues.default_prefix
        });
    } else if (!ClientId && !user) {
        return false
    } else {
        return user
    }
}
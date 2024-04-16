const { Guilds } = require("../Database/Models/Guilds")
const { Users } = require("../Database/Models/Users")

module.exports = async (UserId, GuildId) => {
    let user = await Users.findOne({ where: { UserId: UserId, GuildId: GuildId } });
    if (!user) {

        let bank = Guilds.findOne({ where: { GuildId: GuildId } })?.defaultCoins || 0

        return await Users.create({
            UserId: UserId,
            GuildId: GuildId,
            Bank: bank
        });
    } else {
        return user
    }
}
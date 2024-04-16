const { between } = require("../../base/functions");
const { Guilds } = require("../Database/Models/Guilds");
const checkGuild = require('../functions/checkGuild');
module.exports = {
    name: 'ready',

    run: async (client) => {
        try {

        const inter = setInterval(async () => {
           client.guilds.cache.forEach(async (guild) => {
            let guildDB = await checkGuild(client.user.id, guild.id)
            let gains = guildDB.Gains || {}
            let minimum = gains.dmin || 1000
            let maximum = gains.dmax || 3000
            let newprice = between(minimum, maximum)
            Guilds.update({ DrugPrice: newprice }, { where: { guildId: guild.id }});
        })
        }, 3600000) //3600000
    }
        catch(e) {
            console.log(e)
        }
    }
}
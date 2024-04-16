const { between, newCard } = require("../../base/functions");
const checkGuild = require('../functions/checkGuild');
module.exports = {
    name: 'ready',

    run: async (client) => {
        try {
            let inter = setInterval(async () => {
                client.guilds.cache.forEach(async (guild) => {
                    let randomtimeout = between(1080000, 3600000)
                    setTimeout(async () => {
                        let dataguild = await checkGuild(client.user.id, guild.id)
                        let chan = dataguild.Logs["cards"]
                        let channel = guild.channels.cache.get(chan)
                        if(channel) newCard(client, channel, guild)


                    }, randomtimeout)
                })
            }, 1800000) //1800000
        }
        catch (e) {
            console.log(e)
        }

    }
}

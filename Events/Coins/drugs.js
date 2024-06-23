const Discord = require('discord.js')

module.exports = {
    name: 'ready',
    async execute(bot) {
        const inter = setInterval(async () => {
            bot.guilds.cache.forEach(async (guild) => {
             let guildDB = bot.functions.checkGuild(bot, null, guild.id)
             let gains = JSON.parse(guildDB.gain)
             let minimum = 1000
             let maximum = 3000
             let newprice = between(minimum, maximum)
            gains["drug"] = newprice
            bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(gains), id: guild.id});
         })
         }, 3600000) //3600000
    }
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
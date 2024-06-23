const Discord = require('discord.js')
const config = require('../config.js')
module.exports = {
    name: 'guildCreate',
    async execute(guild, bot) {
        config.buyers.forEach(async u => {
            const user = await bot.users.cache.get(u)
            if(user) user.send(`Je viens de rejoindre ${guild.name} (${guild.memberCount} membres, propriétaire : ${guild.members.cache.get(guild.ownerId).user.username})`)
        })
    }
}
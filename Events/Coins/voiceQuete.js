const Discord = require('discord.js')

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(() => {
    bot.guilds.cache.forEach(guild => {
      guild.members.cache.forEach(member => {
        if (member.voice.channel) {
          const req = bot.functions.checkUser(bot, null, null, member.id)
          if(!req.quete) return
          let json = JSON.parse(req.quete)
          if(json?.type == 3) {
            if(json.nombre == 0) return
            else json["nombre"] = json.nombre - 1
            bot.db.prepare(`UPDATE user SET quete = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: member.id});
          }
        }
      });
    });
  }, 60000);
}}
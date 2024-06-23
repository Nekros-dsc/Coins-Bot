const Discord = require('discord.js')
var items = require("../../Utils/Functions/shop.json");

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(async function () {
            try {
              bot.guilds.cache.forEach(async (guild) => {
                let guildDB = bot.functions.checkGuild(bot, null, guild.id)
      
                const gainTypes = items.bat;
      
                for (const gainType in gainTypes) {
                    const entries = bot.db.prepare('SELECT * FROM user').all()
      
                  for (const user of entries) {
                    const cashGain = JSON.parse(guildDB.gain)[gainType].gain
                    if(JSON.parse(user.batiment).batiments.includes(gainType)) {
                        let json = JSON.parse(user.batiment).batiments
                        if(parseInt(json.count) > JSON.parse(guildDB.gain).entrepotMax) return
                        json["count"] = parseInt(json.count) + cashGain
                        bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: user.id});
                    } 
                  }
                }
              });
            } catch (error) {
              console.error('Une erreur s\'est produite :', error);
            }
          }, 7200000); // 7200000 correspond à 2 heures (en millisecondes)
    }
}
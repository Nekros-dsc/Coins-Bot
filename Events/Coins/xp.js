const Discord = require('discord.js');
const talkedRecently2 = new Set();

module.exports = {
  name: 'messageCreate',
  async execute(message, bot, config) {
    if (message.author.id === bot.user.id || message.author.bot || !message.guild) return

    if (message.content.length > 14) {
      if (!talkedRecently2.has(message.author.id)) {
        let dataguild = bot.functions.checkGuild(bot, null, message.guild.id)
        let user = await bot.functions.checkUser(bot, message, null, message.author.id)
        let xpdata = JSON.parse(dataguild.xp)
        if (xpdata.xp !== false && xpdata.msgxp !== "0" && user) {
          let xpmsg = parseInt(xpdata.msgxp) || 5
          let json = JSON.parse(user.palier)
          json["xp"] = json.xp + xpmsg
          bot.db.prepare(`UPDATE user SET palier = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
          let lvlup = Number(json.level)
          let xp = Number(json.xp) + Number(xpmsg)
          if (lvlup * 1000 <= Number(xp)) {
            json["level"] = json.level + 1;
            json["xp"] = 0
            bot.db.prepare(`UPDATE user SET palier = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
            bot.functions.addCoins(bot, message, null, message.author.id, lvlup * 1000, 'coins')
            let xpchannel = JSON.parse(dataguild.xp).impots
            xpchannel = message.guild.channels.cache.get(xpchannel)
            if (xpchannel) {
              xpchannel.send({ content: `**${message.author} vient de passer palier ${lvlup + 1}** et il gagne \`${lvlup * 1000} coins\` !` }).catch(e => { })
            } else {
              message.reply({ content: `Félicitation ! **Tu viens de passer palier ${lvlup + 1}** et tu gagnes \`${lvlup * 1000} coins\` !` })
            }
          }
        }
      } talkedRecently2.add(message.author.id);
      setTimeout(() => {

        talkedRecently2.delete(message.author.id);
      }, 1500);

    }
  }
}
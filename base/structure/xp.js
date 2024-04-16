const getUser = require("../functions/getUser");
const checkGuild = require("../functions/checkGuild");
const { Users } = require("../Database/Models/Users");
const talkedRecently2 = new Set();
module.exports = {
  name: 'messageCreate',

  run: async (client, message) => {
    if (message.author.id === message.client.user.id || message.author.bot || !message.guild) return

    if (message.content.length > 14) {
      if (!talkedRecently2.has(message.author.id)) {
        let dataguild = await checkGuild(client.user.id, message.guild.id)
        let user = await getUser(message.member.id, message.guild.id)
        let xpdata = dataguild.XP
        if (xpdata.xp !== false && xpdata.msgxp !== 0 && user) {
          let xpmsg = parseInt(xpdata.msgxp) || 5
          await user.increment('XP', { by: xpmsg });
          let lvlup = parseInt(user.level)
          let xp = parseInt(user.XP) + parseInt(xpmsg)
          if (lvlup * 1000 <= xp) {
            await user.increment('level', { by: 1 });
            await Users.update({ XP: 0 }, { where: { primary: user.primary }});
            await user.increment('Coins', { by: lvlup * 1000 });
            let xpchannel = dataguild.Logs["xp"]
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
};
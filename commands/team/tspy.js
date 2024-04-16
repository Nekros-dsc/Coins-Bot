const setCooldown = require('../../base/functions/setCooldown');
const userTeam = require('../../base/functions/teams/userTeam');
module.exports = {
  name: "tspy",
  description: "Permets d'envoyer des troupes à une autre team",
  usage: "tarmysend <teamid> <troupes>",
  aliases: ['tas'],

  run: async (client, message, args, data) => {
    if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "tspy", 3600000, true))) return
    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      authorteam = await userTeam(member.id, message.guild.id)
    } else authorteam = await userTeam(false, message.guild.id, args[0])
    if (!authorteam) return message.reply(":x: Veuillez préciser une team existante")
    let verifteam = await userTeam(message.member.id, message.guild.id)
    if (verifteam && verifteam.teamid == authorteam.teamid) return message.reply(":x: Vous ne pouvez pas \`tspy\` votre propre team !")


    if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "tspy", 3600000))) return
    return message.reply(`📡 \`${authorteam.army || 0} troupes\` sont stockées dans la team **${authorteam.name}** !`)
  }

}

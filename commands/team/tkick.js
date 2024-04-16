const { EmbedBuilder } = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {

  name: "tkick",
  description: "Expulse un membre de sa team",
  aliases: ['t-kick'],

  run: async (client, message, args, data) => {
    let team = await userTeam(message.member.id, message.guild.id)
    let finallb = Object.entries(JSON.parse(team.members))
    const memberData = finallb.find(([id]) => id === message.member.id)
    if (!team || !memberData) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)

    if (memberData[1].rank !== 1) return message.channel.send(`:warning: Vous devez être Leader de la team pour kick !`)

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply(":warning: Utilisateur Invalide")
    if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas vous kick vous-mêmes !")

    let checck = await userTeam(member.id, message.guild.id)
    if (check.teamid === checck.teamid) {
      await teamRemove(member.id, team)

      let embed = new EmbedBuilder()
        .setTitle(message.author.tag + " vient de kick " + member.user.tag + " la team " + name)
        .setDescription(`Aurevoir à lui !`)
        .setColor(data.color)

      return message.channel.send({ embeds: [embed] });

    } return message.channel.send(`:x: ${member.user.tag} n'est pas dans votre team !`)

  }
};
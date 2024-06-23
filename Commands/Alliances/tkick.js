const Discord = require('discord.js');

exports.help = {
  name: 'tkick',
  aliases: ['t-kick'],
  description: 'Expulse un membre de sa team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);
    if (!team || !memberData) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)

    if (memberData.rank !== "1") return message.channel.send(`:warning: Vous devez être Leader de la team pour kick !`)

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply(":warning: Utilisateur Invalide")
    if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas vous kick vous-mêmes !")

    let checck = bot.functions.checkUserTeam(bot, message, args, member.id)
    if (team.id === checck.id) {
        bot.functions.removeTeam(bot, message, args, team.id, member.id, "member")

      let embed = new Discord.EmbedBuilder()
        .setTitle(message.author.tag + " vient de kick " + member.user.tag + " la team " + name)
        .setDescription(`Aurevoir à lui !`)
        .setColor(data.color)

      return message.channel.send({ embeds: [embed] });

    } return message.channel.send(`:x: ${member.user.tag} n'est pas dans votre team !`)

}   
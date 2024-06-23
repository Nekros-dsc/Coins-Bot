const Discord = require('discord.js');

exports.help = {
  name: 'tdemote',
  aliases: ['tderank'],
  description: 'Baisse le grade d\'un membre dans la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)

    if (!team) return message.reply({ content: `:x: Vous n'appartenez à aucune team !`, allowedMentions: { repliedUser: false } })

    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);

    if (memberData.rank === "1") {

      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if (!member) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      let memberteam = bot.functions.checkUserTeam(bot, message, args, member.id)
      if (memberteam.id !== team.id) return message.reply({ content: `:x: ${member.user.username} ne fait pas parti de votre team !`, allowedMentions: { repliedUser: false } })
      if (member.user.id === message.author.id) return message.reply({ content: ":x: Vous ne pouvez pas vous derank vous-mêmes !", allowedMentions: { repliedUser: false } })

      const memberData2 = finallb.find(({ user }) => user === member.id);

      if (memberData2.rank === "3") return message.reply({ content: `:x: ${member.user.username} est déjà membre ! Vous ne pouvez pas plus de derank !`, allowedMentions: { repliedUser: false } })

    bot.functions.addTeam(bot, message, args, team.id, { "user": `${member.id}`, "rank": "3" }, "member")

      return message.reply({ content: `:bookmark_tabs: ${member} est désormais **Membre de la team ${team.name}** !`, allowedMentions: { repliedUser: false } })
    }
}

const userTeam = require("../../base/functions/teams/userTeam");
const teamAdd = require("../../base/functions/teams/teamAdd");

module.exports = {
  name: "tdemote",
  description: "Baisse le grade d'un membre dans la team",
  aliases: ['tderank'],
  cooldown: 4,

  run: async (client, message, args) => {
      let team = await userTeam(message.member.id, message.guild.id)

      if (!team) return message.reply({ content: `:x: Vous n'appartenez à aucune team !`, allowedMentions: { repliedUser: false } })

      let finallb = Object.entries(JSON.parse(team.members))
      const memberData = finallb.find(([id]) => id === message.member.id);

      if (memberData[1].rank === 1) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        let memberteam = await userTeam(member.id, message.guild.id)
        if (memberteam.teamid !== team.teamid) return message.reply({ content: `:x: ${member.user.username} ne fait pas parti de votre team !`, allowedMentions: { repliedUser: false } })
        if (member.user.id === message.author.id) return message.reply({ content: ":x: Vous ne pouvez pas vous derank vous-mêmes !", allowedMentions: { repliedUser: false } })

        const memberData2 = finallb.find(([id]) => id === member.id);

        if (memberData2[1].rank === 3) return message.reply({ content: `:x: ${member.user.username} est déjà membre ! Vous ne pouvez pas plus de derank !`, allowedMentions: { repliedUser: false } })

        teamAdd(member.id, team, 3)

        return message.reply({ content: `:bookmark_tabs: ${member} est désormais **Membre de la team ${team.name}** !`, allowedMentions: { repliedUser: false } })
      } else return message.reply({ content: `:x: Vous devez être le leader de votre team pour derank un membre !`, allowedMentions: { repliedUser: false } })
  }
}
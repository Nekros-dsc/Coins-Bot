const { EmbedBuilder } = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");
const teamAdd = require("../../base/functions/teams/teamAdd");
const teamRemove = require("../../base/functions/teams/teamRemove");
const teamDelete = require("../../base/functions/teams/teamDelete");

module.exports = {
  name: "tleave",
  description: "Permet de quitter votre team actuelle",
  aliases: ['t-leave'],

  run: async (client, message, args, data) => {
    let team = await userTeam(message.member.id, message.guild.id)
    let finallb = Object.entries(JSON.parse(team.members))
    const memberData = finallb.find(([id]) => id === message.member.id)
    if (!team || !memberData) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)
    let nomember = false
    if (finallb.length > 1 && memberData[1].rank === 1) {
      let msgfilter = m => m.author.id == message.author.id;
      message.channel.send(`:eyes: Vous êtes le leader de la team, **vous devez donc donner la propriété de votre team à un membre**, veuillez mentionner le membre:`)

      await message.channel.awaitMessages({ filter: msgfilter, max: 1, time: 100000, errors: ['time'] })
        .then(async cld => {
          var msg = cld.first();
          let member = msg.mentions.members.first()
          if (!member || member.bot) return message.reply(":warning: Utilisateur Invalide")
          let authorteam = await userTeam(member.id, message.guild.id)
          if (!authorteam) return message.channel.send(`:x: Ce joueur n'appartient à aucune team !`)
          if (member.id === message.member.id) return message.reply(`:x: Action annulée !`)
          if (team !== authorteam) return message.channel.send(`:x: ${member.user.username} n'est pas dans votre team !`)
          teamAdd(member.id, team, 1)
        })
    }
    if (nomember == true) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })

    finallb = finallb.map(([memberId, memberData]) => memberId);
    if (finallb.includes(message.author.id)) {
      await teamRemove(message.member.id, team)
      if (finallb.length - 1 === 0) await teamDelete(team, message.guild.id)
    }
    let embed = new EmbedBuilder()
      .setTitle(message.author.tag + " vient de quitter la team " + team.name)
      .setDescription(`Il peut désormais rejoindre une nouvelle team !`)
      .setColor(data.color)
    return message.reply({ embeds: [embed] });
  }
};
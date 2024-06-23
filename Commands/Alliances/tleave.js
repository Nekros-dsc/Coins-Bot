const Discord = require('discord.js');

exports.help = {
  name: 'tleave',
  aliases: ['t-leave'],
  description: 'Permet de quitter votre team actuelle',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!team) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)
    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);
    if (!team || !memberData) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)
    let nomember = false
    if (finallb.length > 1 && memberData.rank === "1") {
      let msgfilter = m => m.author.id == message.author.id;
      message.channel.send(`:eyes: Vous êtes le leader de la team, **vous devez donc donner la propriété de votre team à un membre**, veuillez mentionner le membre:`)

      await message.channel.awaitMessages({ filter: msgfilter, max: 1, time: 100000, errors: ['time'] })
        .then(async cld => {
          var msg = cld.first();
          let member = msg.mentions.members.first()
          if (!member || member.bot) return message.reply(":warning: Utilisateur Invalide")
          let authorteam = bot.functions.checkUserTeam(bot, message, args, member.id)
          if (!authorteam) return message.channel.send(`:x: Ce joueur n'appartient à aucune team !`)
          if (member.id === message.member.id) return message.reply(`:x: Action annulée !`)
          if (team !== authorteam) return message.channel.send(`:x: ${member.user.username} n'est pas dans votre team !`)
        bot.functions.addTeam(bot, message, args, team.id, { "user": `${member.id}`, "rank": "1" }, "member")
        })
    }
    if (nomember == true) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })

    finallb = finallb.map(({ user }) => user);
    if (finallb.includes(message.author.id)) {
        bot.functions.removeTeam(bot, message, args, team.id, message.author.id, "member")
      if (finallb.length - 1 === 0) bot.db.exec(`DELETE FROM team WHERE id = '${team.id}'`);
    }
    let embed = new Discord.EmbedBuilder()
      .setTitle(message.author.tag + " vient de quitter la team " + team.name)
      .setDescription(`Il peut désormais rejoindre une nouvelle team !`)
      .setColor(data.color)
    return message.reply({ embeds: [embed] });
}
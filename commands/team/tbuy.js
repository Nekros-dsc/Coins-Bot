const Discord = require('discord.js');
const userTeam = require('../../base/functions/teams/userTeam');

module.exports = {
  name: "tbuy",
  description: "Permets d'acheter les items du shop de team",
  aliases: ['tbought'],

  run: async (client, message, args, data) => {
    if(args[0]) args[0] = args[0].toLowerCase()
    let team = await userTeam(message.member.id, message.guild.id)
    let finallb = Object.entries(JSON.parse(team.members))
    const memberData = finallb.find(([id]) => id === message.member.id)
    if (!team || !memberData) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)

    // ITEMS PRICE
    let cprice = (data.guild.Prices)["cadenaprice"] || 2

    if (args[0] == 'info' || !args[0]) {


      let Embed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Voici la boutique des teams du serveur ` + message.guild.name)
        .setDescription(`**cadena**\nPrix: ${cprice} rep`)
        .setFooter({ text: `Les items sont payés avec les rep de team` })
      message.channel.send({ embeds: [Embed2] })

    } else if (args[0] == 'cadena' || args[0] == 'cadenas') {

      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: La team a besoin de ${cprice} rep pour acheter un **cadena**`);
      if (team.rep < cprice) return message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })

      if (team.cadenas < 0 || team.cadenas > 5) team.update({ cadenas: 1 }, { where: { primary: team.primary }});
      if (team.cadenas >= 5) return message.channel.send(`:x: La team a atteint sa limite de **cadenas**`)


      let Embed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:white_check_mark: Vous avez acheté un **cadena** pour \`${cprice} rep team\``);
        await team.increment('cadenas', { by: 1 });
        await team.decrement('rep', { by: cprice });
      message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })

    } else {
      let embed3 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(':x: Entrez un batiment à acheter !\nPour plus d\'informations utilisez la commande \`buy info\`')
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      message.reply({ embeds: [embed3], allowedMentions: { repliedUser: false } })
    }

  }
}


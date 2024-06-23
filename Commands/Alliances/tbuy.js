const Discord = require('discord.js');

exports.help = {
  name: 'tbuy',
  aliases: ['tbought'],
  description: 'Permets d\'acheter les items du shop de team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    if(args[0]) args[0] = args[0].toLowerCase()
        let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
        if (!team) return message.channel.send(`:x: Vous ne faites pas partie d'une team. !`)
    
        // ITEMS PRICE
        let cprice = JSON.parse(data.gain).cadenas
    
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
          if (team.cadenas >= 5) return message.channel.send(`:x: La team a atteint sa limite de **cadenas**`)
    
    
          let Embed2 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:white_check_mark: Vous avez acheté un **cadena** pour \`${cprice} rep team\``);
            bot.functions.addTeam(bot, message, args, team.id, 1, "cadenas")
            bot.functions.removeTeam(bot, message, args, team.id, cprice, "rep")
          message.reply({ embeds: [Embed2], allowedMentions: { repliedUser: false } })
    
        } else {
          let embed3 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(':x: Entrez un batiment à acheter !\nPour plus d\'informations utilisez la commande \`buy info\`')
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
          message.reply({ embeds: [embed3], allowedMentions: { repliedUser: false } })
        }
}
const Discord = require('discord.js');

exports.help = {
  name: 'twith',
  aliases: ['t-with'],
  description: 'Retire de l\'argent dans la banque de la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)

    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);
    if (memberData.rank == "3") return message.channel.send(`:warning: Vous devez être **Créateur** de la team ou **Officier** pour retirer de l'argent !`)

    if (args[0] == 'all') {
      let money = JSON.parse(team.coins).coins
      let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Il n'y a pas d'argent à retirer !")
      if (!verifnum(money)) return message.channel.send({ embeds: [embedbank] })
    bot.functions.addCoins(bot, message, args, message.author.id, money, 'coins')
      bot.functions.removeTeam(bot, message, args, team.id, money, "coins")
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez retiré \`${money} coins\` de la banque de la team !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      message.channel.send({ embeds: [embed5] })

    } else {

      let embed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Spécifiez un montant à retirer`);
      let amount = args[0]
      if (!amount) return message.channel.send({ embeds: [embed2] })

      let embed3 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous ne pouvez pas récupérer ce montant`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      if (!verifnum(amount)) return message.channel.send({ embeds: [embed3] })
      amount = parseInt(amount)
      let embed4 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Il n'y a pas assez pour retirer tout cela !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      if (JSON.parse(team.coins).coins < amount || JSON.parse(team.coins).coins <= 0) return message.channel.send({ embeds: [embed4] })

      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.tag}, vous avez retiré \`${amount} coins\` de la banque de la team`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

        bot.functions.addCoins(bot, message, args, message.author.id, amount, 'coins')
        bot.functions.removeTeam(bot, message, args, team.id, amount, "coins")

      message.channel.send({ embeds: [embed5] })
    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
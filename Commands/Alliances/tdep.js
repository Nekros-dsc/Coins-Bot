const Discord = require('discord.js');

exports.help = {
  name: 'tdep',
  aliases: ['t-dep'],
  description: 'Dépose de l\'argent dans la banque de la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)

    let member = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
    if (args[0] == 'all') {
      let money = member
      let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Vous n'avez pas d'argent à déposer !")

      if (isNaN(money) || !money || parseInt(money) <= 0) return message.channel.send({ embeds: [embedbank] })

        bot.functions.removeCoins(bot, message, args, message.author.id, money, 'coins')
        bot.functions.addTeam(bot, message, args, team.id, money, "coins")

      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez déposé \`${money} coins\` dans la banque de votre team !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      message.channel.send({ embeds: [embed5] })

    } else {
      let embed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Merci de préciser un montant à déposer`);
      let money = args[0]
      if (!money) return message.channel.send({ embeds: [embed2] })
      money = parseInt(money)
      if (!verifnum(money)) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })
      let embed4 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas assez d'argent`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      if (member < money) return message.channel.send({ embeds: [embed4] })

      bot.functions.removeCoins(bot, message, args, message.author.id, money, 'coins')
      bot.functions.addTeam(bot, message, args, team.id, money, "coins")

      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez déposé \`${money} coins\` dans la banque de votre team !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      message.reply({ embeds: [embed5] })

    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
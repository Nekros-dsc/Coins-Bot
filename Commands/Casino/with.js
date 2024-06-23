const Discord = require('discord.js');

exports.help = {
  name: 'with',
  aliases: ['wh' , 'without'],
  description: 'retire de l\'argent de votre banque',
  use: 'with <amount/all>',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    let user = message.member.user;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    let money = JSON.parse(memberDB.coins).bank
    if (args[0] == 'all') {
      let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Vous n'avez pas d'argent à retirer !")
      if (parseInt(money) <= 0) return message.reply({ embeds: [embedbank], allowedMentions: { repliedUser: false } })

    bot.functions.removeCoins(bot, message, args, message.author.id, parseInt(money), 'bank')
    bot.functions.addCoins(bot, message, args, message.author.id, parseInt(money), 'coins')
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez retiré \`${money} coins\` de votre banque !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })

    } else {


      if (!args[0]) return message.reply({ content: `:x: Merci de préciser un montant à payer`, allowedMentions: { repliedUser: false } })
      if (!verifnum(args[0])) return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })

      let embed4 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous n'avez pas tout cet argent !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      if (money < parseInt(args[0]) || money <= 0) return message.reply({ embeds: [embed4], allowedMentions: { repliedUser: false } })


      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez retiré \`${args[0]} coins\` de votre banque`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
    bot.functions.removeCoins(bot, message, args, message.author.id, parseInt(args[0]), 'bank')
    bot.functions.addCoins(bot, message, args, message.author.id, parseInt(args[0]), 'coins')
    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
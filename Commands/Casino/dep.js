const Discord = require('discord.js');

exports.help = {
  name: 'dep',
  aliases: ['deposit'],
  description: 'Dépose votre argent en banque',
  use: 'dep <amount/all>',
  category: 'Casino'
}
exports.run = async (bot, message, args, config, data) => {
    const req = bot.functions.checkUser(bot, message, args, message.author.id)
    const memberCoins = JSON.parse(req.coins).coins
    if (!args[0]) {
        message.reply({ content: `:x: Merci de préciser un montant à déposer`, allowedMentions: { repliedUser: false } });
    } else if (args[0].toLowerCase() === 'all') {
        if (!verifnum(memberCoins)) {

          message.reply({ content: ":x: Vous n'avez pas d'argent à déposer !", allowedMentions: { repliedUser: false } });
        } else {
        bot.functions.removeCoins(bot, message, args, message.author.id, memberCoins, 'coins')
        bot.functions.addCoins(bot, message, args, message.author.id, memberCoins, 'bank')

        let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.username}, vous avez déposé \`${memberCoins} coins\` dans votre banque !`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

        message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
        }
    } else {
        if (!verifnum(args[0])) {

          message.reply({ content: `:x: Merci de saisir un montant valide !`, allowedMentions: { repliedUser: false } });
        } else {

          const amountToDeposit = parseInt(args[0]);

        if (memberCoins < amountToDeposit) {
            let embed4 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous n'avez pas assez d'argent pour déposer ${amountToDeposit} coins !`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
            message.reply({ embeds: [embed4], allowedMentions: { repliedUser: false } });
          } else {
            bot.functions.removeCoins(bot, message, args, message.author.id, amountToDeposit, 'coins')
            bot.functions.addCoins(bot, message, args, message.author.id, amountToDeposit, 'bank')

            let embed5 = new Discord.EmbedBuilder()
              .setColor(data.color)
              .setDescription(`:coin: ${message.member.user.username}, vous avez déposé \`${amountToDeposit} coins\` dans votre banque !`)
              .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

            message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } });
          }
        }
      }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
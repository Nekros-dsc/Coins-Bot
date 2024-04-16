const Discord = require("discord.js");
const { verifnum } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
module.exports = {
  name: "with",
  usage: "with <amount/all>",
  description: "retire de l'argent de votre banque",
  aliases: ['wh', "without"],

  run: async (client, message, args, data) => {
    let user = message.member.user;
    let memberDB = (await getUser(user.id, message.guild.id))
    let money = memberDB.Bank
    if (args[0] == 'all') {
      let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Vous n'avez pas d'argent à retirer !")
      if (parseInt(money) <= 0) return message.reply({ embeds: [embedbank], allowedMentions: { repliedUser: false } })

      memberDB.decrement('Bank', { by: money });
      memberDB.increment('Coins', { by: money });
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.tag}, vous avez retiré \`${money} coins\` de votre banque !`)
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
        .setDescription(`:coin: ${message.member.user.tag}, vous avez retiré \`${args[0]} coins\` de votre banque`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
      memberDB.decrement('Bank', { by: args[0] });
      memberDB.increment('Coins', { by: args[0] });
    }
  }
}
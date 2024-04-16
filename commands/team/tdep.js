const { verifnum } = require("../../base/functions");
const Discord = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");
const getUser = require("../../base/functions/getUser");
const removeCoins = require("../../base/functions/removeCoins");


module.exports = {
  name: "tdep",
  description: "Dépose de l'argent dans la banque de la team",
  aliases: ['t-dep'],

  run: async (client, message, args, data) => {
    client.queue.addJob(async (cb) => {
      let team = await userTeam(message.member.id, message.guild.id)
      if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)

      let member = (await getUser(message.member.id, message.guild.id)).Coins
      cb()
      if (args[0] == 'all') {
        let money = member
        let embedbank = new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(":x: Vous n'avez pas d'argent à déposer !")

        if (isNaN(money) || !money || parseInt(money) <= 0) return message.channel.send({ embeds: [embedbank] })

        removeCoins(message.member.id, message.guild.id, money, "coins")
        await team.increment('coins', { by: money });

        let embed5 = new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:coin: ${message.member.user.tag}, vous avez déposé \`${money} coins\` dans la banque de votre team !`)
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

        removeCoins(message.member.id, message.guild.id, money, "coins")
        await team.increment('coins', { by: money });


        let embed5 = new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`:coin: ${message.member.user.tag}, vous avez déposé \`${money} coins\` dans la banque de votre team !`)
          .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

        message.reply({ embeds: [embed5] })

      }
    })
  }
}

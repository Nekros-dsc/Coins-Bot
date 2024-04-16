const Discord = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");
const { verifnum } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");

module.exports = {
  name: "twith",
  description: "Retire de l'argent dans la banque de la team",
  aliases: ['t-with'],

  run: async (client, message, args, data) => {
    let team = await userTeam(message.member.id, message.guild.id)
    if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)

    let finallb = Object.entries(JSON.parse(team.members))
    const memberData = finallb.find(([id]) => id === message.member.id);
    if (memberData[1].rank !== 2 && memberData[1].rank !== 1) return message.channel.send(`:warning: Vous devez être **Créateur** de la team ou **Officier** pour retirer de l'argent !`)

    if (args[0] == 'all') {
      let money = team.coins
      let embedbank = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(":x: Il n'y a pas d'argent à retirer !")
      if (!verifnum(money)) return message.channel.send({ embeds: [embedbank] })
      addCoins(message.member.id, message.guild.id, money, "coins")
      await team.decrement('coins', { by: money });
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.tag}, vous avez retiré \`${money} coins\` de la banque de la team !`)
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

      if (team.coins < amount || team.coins <= 0 || !team.coins) return message.channel.send({ embeds: [embed4] })

      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:coin: ${message.member.user.tag}, vous avez retiré \`${amount} coins\` de la banque de la team`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

      addCoins(message.member.id, message.guild.id, amount, "coins")
      await team.decrement('coins', { by: amount });

      message.channel.send({ embeds: [embed5] })
    }
  }
}
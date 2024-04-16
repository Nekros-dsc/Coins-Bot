const Discord = require("discord.js");
const { webhook, wlog, between } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const setCooldown = require("../../base/functions/setCooldown");
module.exports = {
  name: "daily",
  description: "Donne une grosse somme de coins chaque jour",
  cooldown: 2,
  aliases: ['dy'],

  run: async (client, message, args, data) => {

    const color = data.color

    if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "daily", 43200000))) return

    let gains = data.guild.Gains|| {}
    let minimum = gains.dmin || 100
    let maximum = gains.dmax || 600
    
    const randomnumber = between(minimum, maximum)
    addCoins(message.member.id, message.guild.id, randomnumber, "coins")
    let embed5 = new Discord.EmbedBuilder()
      .setColor(color)
      .setDescription(`:coin: Vous venez de gagner \`${randomnumber} coins\`\nVous pourrez réutiliser cette commande dans 12 heures !`)
      .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Votre \`daily\` vous a rapporté \`\`${randomnumber} coins\`\``)
    wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${randomnumber} coins\`\``, "Daily")


  }
}

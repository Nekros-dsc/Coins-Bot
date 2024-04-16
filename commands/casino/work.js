const Discord = require("discord.js");
const { wlog, between } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const setCooldown = require("../../base/functions/setCooldown");

module.exports = {
  name: "work",
  description: "Fais gagner une somme de coins",
  aliases: ['wk'],

  run: async (client, message, args, data) => {

    let gains = data.guild.Gains || {}
    let minimum = gains.wmin || 10
    let maximum = gains.wmax || 250

    if(!(await setCooldown(message, data.color, message.author.id, message.guild.id, "work", 3600000, false))) return


    const randomnumber = between(minimum, maximum)
    addCoins(message.member.id, message.guild.id, randomnumber, "coins")
    let embed5 = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setDescription(`:coin: ${message.author.username}, Vous venez de gagner \`${randomnumber} coins\``)
      .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Votre \`work\` vous a rapporté \`\`${randomnumber} coins\`\``)
    wlog(message.author, "GREEN", message.guild, `${message.author.username} vient de gagner \`\`${randomnumber} coins\`\``, "Work")

  }
}


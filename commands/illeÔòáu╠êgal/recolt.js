const Discord = require("discord.js");
const { webhook, wlog, between } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const setCooldown = require("../../base/functions/setCooldown");
const getUser = require("../../base/functions/getUser");

module.exports = {
  name: "recolt",
  description: "Récolte la drogue",
  aliases: ['drugs', 'rt'],

  run: async (client, message, args, data) => {
    message.delete().catch(e => { })
    let capa = (await getUser(message.member.id, message.guild.id)).Capacite
    if (capa === "cultivateur") {
      if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "recolt", 10800000))) return
      let gains = data.guild.Gains
      let minimum = gains.dmin || 1
      let maximum = gains.dmax || 2 
      const randomnumber = between(minimum, maximum)
      addCoins(message.member.id, message.guild.id, randomnumber, "drugs")
      let embed5 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:pill: Un joueur vient de récolter \`${randomnumber} 💊\``)
        .setFooter({ text: `Commande Anonyme` })
      message.channel.send({ embeds: [embed5], allowedMentions: { repliedUser: false } })
      wlog(message.author, "PURPLE", message.guild, `${message.author.tag} vient de gagner \`\`${randomnumber} 💊\`\``, "Recolt")

    } else message.channel.send({
      embeds: [new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:x: Vous devez avoir la capacité **cultivateur** pour utiliser cette commande !`)
        .setFooter({ text: `Commande Anonyme` })], ephemeral: true
    })

  }
}



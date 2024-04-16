const Discord = require("discord.js");
const { webhook, wlog, between } = require("../../base/functions");
const fetch = require("node-fetch");
const setCooldown = require("../../base/functions/setCooldown");
const addCoins = require("../../base/functions/addCoins");
module.exports = {
  name: "slut",
  description: "Fais gagner une somme de coins",
  aliases: ['st'],

  run: async (client, message, args, data) => {
    if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "slut", 21600000, true, false))) return

    const url = `https://top.gg/api/bots/874400416731922432/check?userId=${message.author.id}`; // api endpoint
    fetch(url, { method: "GET", headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3NDQwMDQxNjczMTkyMjQzMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI4NzE4MDA5fQ.I3n7DBVf4kWacgxxdYwvKRaI-d0RfvmXTPeCx9V649c" } })
    //on te soutien MIllenium !!!
      .then((res) => res.text())
      .then(async (json) => {
        var isVoted = JSON.parse(json).voted;
        if (isVoted) {
          let gains = data.guild.Gains || {}
          let minimum = gains.smin || 100
          let maximum = gains.smax || 600
          const randomnumber = between(minimum, maximum)
          addCoins(message.member.id, message.guild.id, randomnumber, "coins")
          if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "slut", 21600000))) return
          let embed5 = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:coin: ${message.author.tag}, Vous venez de gagner \`${randomnumber} coins\``)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
          message.reply({ embeds: [embed5], allowedMentions: { repliedUser: false } })
          //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Votre \`slut\` vous a rapporté \`\`${randomnumber} coins\`\``)
          wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de gagner \`\`${randomnumber} coins\`\``, "Slut")
        } else return message.reply({
          embeds: [new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous devez votez pour utiliser cette commande !\n[Cliquez ici pour voter](https://top.gg/bot/874400416731922432/vote)`)
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })]
        })
      })


  }
}

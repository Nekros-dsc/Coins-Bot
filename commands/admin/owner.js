
const Discord = require("discord.js");
const { Bots } = require("../../base/Database/Models/Bots");
module.exports = {
  name: "owner",
  description: "Ajoute un membre aux owner",
  aliases: ['owner-add'],

  run: async (client, message, args, data) => {

    const botDB = await Bots.findOne({
      where: {
        botid: client.user.id 
      }
    });
    if(!botDB) return message.reply(":warning: Votre bot n'est pas inscrit dans la base de donnée d'EpicBots, veuillez contacter le support ! ")
    let actualowners = JSON.parse(botDB.Owners) || {}
    const founder = client.config.owner
    if (founder.includes(message.author.id)) {
      if(args[0] ) args[0] = args[0].toLowerCase()
      if (args[0] === "clear") {
        actualowners = {}
        actualowners[message.member.id] = true
        Bots.update({ Owners: actualowners }, { where: { id: botDB.id }});
        return message.reply(`:recycle: Les owner ont bien été clear !`)

      } else if (!args[0]) {
        let difarr = Object.keys(actualowners);

        let finallb = ""
        let allmemberlen = ""
        if (!difarr) { finallb = "Aucun owner" } else {
          allmemberlen = difarr.length
          let people = 0;
          let peopleToShow = 31;

          let mes = [];

          for (let i = 0; i < allmemberlen; i++) {
            if (difarr === null) continue;
            let g = client.users.cache.get(difarr[i])

            if (!g) {
              g = `<@${difarr[i]}> (id: ${difarr[i]})`
            } else {
              g = `<@${difarr[i]}>`
            }
            mes.push({
              name: g
            });
          }

          const realArr = []
          for (let k = 0; k < mes.length; k++) {
            people++
            if (people >= peopleToShow) continue;
            realArr.push(`${k + 1}) ${mes[k].name}`);
          }
          finallb = realArr.join("\n")
          let p = 1000 - mes.length;
          if (p < 0) {
            p = p * (-1);
          }
        }
        let owner = new Discord.EmbedBuilder()
          .setTitle(`Owner list`)
          .setDescription(finallb)
          .setColor(data.color)
          .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

        return message.reply({ embeds: [owner], allowedMentions: { repliedUser: false } })

      } else {
        let m = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!m || m.bot) return message.reply({ content: "\`❌\` `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })

        if (actualowners[m.user.id]) return message.reply(`\`❌\` ${m.user.username} est déjà owner !`)

          actualowners[m.user.id] = true
          Bots.update({ Owners: actualowners }, { where: { id: botDB.id }});
          return message.reply(`\`✅\` ${m.user.username} est maintenant owner du bot !`)

      }
    }

  }
}
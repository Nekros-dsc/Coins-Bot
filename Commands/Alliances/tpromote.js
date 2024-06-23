const Discord = require('discord.js');

exports.help = {
  name: 'tpromote',
  aliases: ['trankup'],
  description: 'Augmente le grade d\'un membre dans la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!team) return message.reply({ content: `:x: Vous n'appartenez à aucune team !`, allowedMentions: { repliedUser: false } })

    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })

    if (memberData.rank === "1") {

      if (member.user.id === message.author.id) return message.reply(":x: Vous ne pouvez pas vous rankup vous-mêmes !")
      let memberteam = bot.functions.checkUserTeam(bot, message, args, member.id)
      if (memberteam.id !== team.id) return message.reply(`:x: ${member.user.username} ne fait pas parti de votre team !`)

      const memberData2 = finallb.find(({ user }) => user === member.id);
      if (memberData2.rank === "2") {
        let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('yes').setEmoji("✅").setLabel(`Oui je le veux`)

        let button_row = new Discord.ActionRowBuilder().addComponents([button_back])

        return message.channel.send({
          content: `:question: Êtes-vous sûr de vouloir donner la propriété de la team à ${member} ?`,
          components: [button_row],
          allowedMentions: { repliedUser: false }
        }).then(m => {

          const collector = m.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 30000
          })
          collector.on("collect", async (i) => {
            if (i) {
              if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces bouttons !", ephemeral: true }).catch(() => { })
              collector.stop()
              await i.deferUpdate().catch(() => { })

              if (i.customId === 'yes') {
                bot.functions.addTeam(bot, message, args, team.id, { "user": `${member.id}`, "rank": "1" }, "member")
                bot.functions.addTeam(bot, message, args, team.id, { "user": `${message.author.id}`, "rank": "2" }, "member")
                button_row.components[0].setDisabled(true);
                m.edit({ components: [button_row] }).catch(() => { })
                return message.channel.send(`:beginner: ${member} est désormais **créateur de la team ${team.name}** !`)
              }
            }
          })
        })
      }
      bot.functions.addTeam(bot, message, args, team.id, { "user": `${member.id}`, "rank": "2" }, "member")

      return message.reply(`:bookmark_tabs: ${member} est désormais **Officier de la team ${team.name}** !`)

    } else return message.reply(`:x: Vous devez être le leader de votre team pour rankup un membre !`)
}
const Discord = require('discord.js');

exports.help = {
  name: 'tinvite',
  aliases: ['t-invite'],
  description: 'Invite un membre dans votre team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
    if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member || member.bot) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
    if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas vous inviter vous-mêmes !")

    let check = bot.functions.checkUserTeam(bot, message, args, member.id)
    let finallb = JSON.parse(team.members)
    if (!check) {
      if (check === team) return message.channel.send(`:x: ${member.user.username} est déjà dans votre team !`)


      if (finallb.length) {
        if (finallb.length >= 15) return message.channel.send(`Votre team ne peut avoir que 15 membres maximum !`)
      }
      const memberData = finallb.find(({ user }) => user === message.author.id);
      if (memberData.rank === "3") return message.channel.send(`:warning: Vous devez être Officier ou Leader de la team pour inviter !`)

      const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Faire une action')
            .addOptions([
              {
                label: 'Accepter',
                description: 'Permet d\'accepter l\'invitation',
                value: 'accept',
              }
            ]),
        );

      let moneyEmbed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setThumbnail("https://media.discordapp.net/attachments/1249042420163674153/1250129687187947520/unknown.png?ex=6669d17f&is=66687fff&hm=8821127f9dac9c58a344eb75cc0d07104753e3235fbc0253fffbb0384386917b&=&format=webp&quality=lossless&width=1605&height=1605")
        .setDescription(`:question: <@${member.user.id}> acceptes-tu l'invitation dans la team **${team.name}** ?\n_Tu as 30 secondes pour accepter_`);
      message.reply({
        embeds: [moneyEmbed],
        components: [row], allowedMentions: { repliedUser: false }
      }).then(m => {

        const collector = m.createMessageComponentCollector({
          componentType: Discord.ComponentType.SelectMenu,
          time: 30000
        })
        collector.on("collect", async (select) => {
          if (select.user.id !== member.user.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
          const value = select.values[0]
          await select.deferUpdate()
          if (value == 'accept') {
            let checkkk = bot.functions.checkUserTeam(bot, message, args, member.id)
            team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
            if (!team) return message.channel.send(":x: Vous n'avez pas pu rejoindre la team car elle n'existe plus !")
            if (checkkk === team) return message.channel.send(`:x: ${member.user.username}, vous avez déjà rejoint la team !`)
            if (checkkk) return message.channel.send(`:x: ${member.user.username}, vous êtes déjà dans une team !`)
            finallb = JSON.parse(team.members)
            if (finallb.length) {
              if (finallb.length >= 15) return message.channel.send(`Votre team ne peut avoir que 15 membres maximum !`)
            }
            bot.functions.addTeam(bot, message, args, team.id, { "user": `${member.id}`, "rank": "3" }, "member")
            m.delete()
            return select.followUp({ content: `# Bienvenue à toi, ${member.user.username} dans ${team.name}`.replaceAll('@', "") });

          }
        })
        collector.on("end", async () => {
          return m.edit({components: [] }).catch(() => { })
        })
      })
    } else return message.channel.send(`:x: ${member.user.username} appartient déjà à une team !`)
}
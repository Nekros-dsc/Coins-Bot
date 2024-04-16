const Discord = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");
const teamAdd = require("../../base/functions/teams/teamAdd");
module.exports = {
  name: "tinvite",
  description: "Invite un membre dans votre team",
  aliases: ['t-invite'],

  run: async (client, message, args, data) => {
    let team = await userTeam(message.member.id, message.guild.id)
    if (!team) return message.channel.send(`:x: Vous n'appartenez à aucune team !`)
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member || member.bot) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
    if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas vous inviter vous-mêmes !")



    let check = await userTeam(member.id, message.guild.id)
    let finallb = Object.entries(JSON.parse(team.members))
    if (!check) {
      if (check === team) return message.channel.send(`:x: ${member.user.username} est déjà dans votre team !`)


      if (finallb.length) {
        if (finallb.length >= 15) return message.channel.send(`Votre team ne peut avoir que 15 membres maximum !`)
      }
      const memberData = finallb.find(([id]) => id === message.member.id);
      if (memberData[1].rank === 3) return message.channel.send(`:warning: Vous devez être Officier ou Leader de la team pour inviter !`)

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
        .setThumbnail("https://media.discordapp.net/attachments/931284573306892348/998915745008336936/unknown.png?width=676&height=676")
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
            let checkkk = await userTeam(member.id, message.guild.id)
            team = await userTeam(message.member.id, message.guild.id)
            if (!team) return message.channel.send(":x: Vous n'avez pas pu rejoindre la team car elle n'existe plus !")
            if (checkkk === team) return message.channel.send(`:x: ${member.user.username}, vous avez déjà rejoint la team !`)
            if (checkkk) return message.channel.send(`:x: ${member.user.username}, vous êtes déjà dans une team !`)
            finallb = Object.entries(JSON.parse(team.members))
            if (finallb.length) {
              if (finallb.length >= 15) return message.channel.send(`Votre team ne peut avoir que 15 membres maximum !`)
            }
            teamAdd(member.id, team, 3)
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


};
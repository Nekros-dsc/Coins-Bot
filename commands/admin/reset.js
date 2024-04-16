const Discord = require("discord.js");
const teamRemove = require("../../base/functions/teams/teamRemove");
const userTeam = require("../../base/functions/teams/userTeam");
const { Cards } = require("../../base/Database/Models/Cards");
module.exports = {
  name: "reset",
  description: "Reset le serveur où un utilisateur (user / server)",
  cooldown: 5,
  owner: true,
  run: async (client, message, args, data) => {

    let guild = data.guild
    if (guild.dataValues.Add) return message.channel.send(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot ! `)

    let dureefiltrer = response => { return response.author.id === message.author.id };
    if (!args[0]) {
      return message.reply({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setDescription(`\`reset all\` : Reset l'économie du serveur
\`reset user\` : Reset l'économie d'un utilisateur
\`reset cards\` : Reset les cartes`)]
      })
    }
    if (args[0].toLowerCase() === "cards" || args[0].toLowerCase() === "card") {

      message.channel.send(`:warning: Êtes-vous sûr de vouloir reset les cartes ? \nLes joueurs perdront leurs cartes et les statistiques des cartes seront recrées.\nRépondez "oui" à ce message pour poursuivre le reset !`)
      message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
        .then(async cld => {
          var msg = cld.first();
          let response = msg.content.toLowerCase()
          if (response === "oui") {

            message.channel.send(`:recycle: Reset en cours...`)
            await Cards.destroy({
              where: {
                guildId: message.guild.id
              }
            });
            message.reply({
              embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`🃏 Les cartes ont été reset !`)
                .setFooter({ text: `${message.member.user.username}`, icon: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
            })

          } else return message.channel.send(`Reset annulé`)

        })
    } else if (args[0] === "user") {
      let user = ""
      message.channel.send(`:eyes: Mentionnez un utilisateur à reset:`)
      message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
          var msgg = cld.first();
          user = msgg.mentions.members.first()
        }).then(lalalala => {

          message.channel.send(`:warning: Êtes-vous sûr de vouloir reset l'économie de ${user} ? \nRépondez "oui" à ce message pour poursuivre son reset !`)
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              var msg = cld.first();
              if (msg.content.toLowerCase() === "oui") {
                await message.reply(`:recycle: Reset en cours...`)

                let team = await userTeam(user.id, message.guild.id)
                await data.users.destroy({ where: { GuildId: message.guild.id, UserId: user.id } });
                if (team) {
                  let finallb = Object.entries(JSON.parse(team.members))
                  const memberData = finallb.find(([id]) => id === user.id)
                  if (team && memberData[1].rank !== 1) {
                    await teamRemove(user.id, team)
                  }
                }
                await Cards.destroy({
                  where: {
                    proprio: user.id,
                    guildId: message.guild.id
                  }
                });

                message.channel.send({
                  embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:coin: L'économie actuelle de ${user} a bien été reset !`)
                    .setFooter({ text: `${message.member.user.username}`, icon: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                })
              } else return message.channel.send(`Reset annulé`)

            })
        })
    } else if (args[0].toLowerCase() == "all") {
      message.channel.send(`:warning: Êtes-vous sûr de vouloir reset l'économie du serveur ? \nLes paramètres actuels ne seront pas mofifiés.\nRépondez "oui" à ce message pour poursuivre le reset !`)
      message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
        .then(async cld => {
          var msg = cld.first();
          if (msg.content.toLowerCase() === "oui") {
            message.channel.send(`:recycle: Reset en cours...`)
            await data.users.destroy({ where: { GuildId: message.guild.id } });
            message.reply({
              embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:coin: L'économie actuelle a bien été reset \nLes configurations n'ont pas été modifiés durant le reset `)
                .setFooter({ text: `${message.member.user.username}`, icon: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
            })

          } else return message.channel.send(`Reset annulé`)

        })
    }

  }
}
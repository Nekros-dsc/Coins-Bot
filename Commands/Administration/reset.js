const Discord = require('discord.js');

exports.help = {
  name: 'reset',
  aliases: [],
  description: 'Reset le serveur où un utilisateur (user / server)',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    let guild = data

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

                let team = bot.functions.checkUserTeam(bot, message, args, user.id)
                if (team) bot.functions.removeTeam(bot, message, args, team.id, user.id, "member")
                bot.db.exec(`DELETE FROM user WHERE id = '${user.id}'`);

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
            bot.db.exec(`DELETE FROM user`);
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
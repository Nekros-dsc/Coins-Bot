const Discord = require('discord.js')
const { Bots } = require("../../base/Database/Models/Bots");
module.exports = {
  name: "setprofil",
  description: "Modifie avatar, pseudo ou encore activité du bot !",
  aliases: ['setprofile'],
  owner: true,
  run: async (client, message, args, data) => {
    const { id } = client.config

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Faire une action')
          .addOptions([
            {
              label: 'Nom',
              description: 'Change le nom du bot',
              value: 'name',
              emoji: "✏️",
            },
            {
              label: 'Avatar',
              description: 'Change l\'image de profil du bot',
              value: 'pp',
              emoji: "🎬",
            },
            {
              label: 'Activité',
              description: 'Change l\'activité et le type d\'activité du bot',
              value: 'activity',
              emoji: "📱",
            },
            {
              label: 'Valider',
              description: 'Ferme le menu',
              value: 'x',
              emoji: "❌",
            }
          ]),
      );
      const BOTDB = await Bots.findOne({
        where: {
          id: id
        }
      });
      if(!BOTDB) return message.reply(":x: Le bot n'est pas enregistré dans la db, veuillez contacter le développeur du bot")
    let msg = await message.reply({ content: "Chargement ...", allowedMentions: { repliedUser: false } })
    const embed = new Discord.EmbedBuilder()
      .setTitle(`**__Paramètres du profile du bot__**`)
      .setTimestamp()
      .setColor(data.color)
      .setFooter({ text: `${client.user.username}` })
      .setDescription(`✏️・Changer le nom d'utilisateur\nActuel: ${client.user.username}\n\n🎬・Changer l'avatar\nActuel: [Clique ici](${client.user.displayAvatarURL()})\n\n📱・Changer l'activitée\nActuel: ${client.user.presence.activities[0] ? ` ${client.user.presence.activities[0].name}` : `:x:`}`)
    msg.edit({
      content: "** **", embeds: [embed],
      components: [row], allowedMentions: { repliedUser: false }
    }).then(async (m) => {


      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 90000
      })

      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
        const value = select.values[0]
        await select.deferUpdate()
        if (value == 'name') {

          let question = await message.channel.send("Quel nom voulez-vous attribuer au bot ?",)
          const filter = m => message.author.id === m.author.id;
          message.channel.awaitMessages({
            filter: filter,
            max: 1,
            time: 60000,
            errors: ['time']
          }).then(async (collected) => {
            collected.first().delete()
            question.delete()
            client.user.setUsername(collected.first().content).then(async () => {
              update()
            }).catch(async (err) => {
              console.log(err)
              collected.first().delete()
              message.channel.send(":x: Je n'ai pas pu changer mon pseudo :/").then((mm) => mm.delete({
                timeout: 5000
              }));
            })
          })
        }
        if (value == 'pp') {
          let question = await message.channel.send("Quel avatar voulez-vous attribuer au bot ?")
          const filter = m => message.author.id === m.author.id;
          message.channel.awaitMessages({
            filter: filter,
            max: 1,
            time: 60000,
            errors: ['time']
          }).then(async (collected) => {
            let url
            let msg = collected.first()
            if (msg.attachments.size > 0) { url = msg.attachments.first().url } else url = msg.content
            collected.first().delete()
            question.delete()
            client.user.setAvatar(url).then(async () => {
              update()
            }).catch(async (err) => {
              console.log(err)
              collected.first().delete()
              message.channel.send(":x: Je n'ai pas pu changer mon avatar car le lien est invalide :/").then((mm) => mm.delete({
                timeout: 5000
              }));
            })
          })
        }

        if (value == 'activity') {
          let question = await message.channel.send("Quel type d'activité voulez-vous attribuer au bot (\`play\`, \`stream\`, \`watch\`, \`listen\`)")
          const filter = m => message.author.id === m.author.id;

          message.channel.awaitMessages({
            filter: filter,
            max: 1,
            time: 60000,
            errors: ['time']
          }).then(async (collected) => {
            collected.first().delete()
            question.delete()
            let type = ""

            if (collected.first().content.toLowerCase().startsWith("play")) {
              type = "PLAYING"
            } else if (collected.first().content.toLowerCase().startsWith("stream")) {
              type = "STREAMING"
            } else if (collected.first().content.toLowerCase().startsWith("listen")) {
              type = "LISTENING"
            } else if (collected.first().content.toLowerCase().startsWith("watch")) {
              type = "WATCHING"
            } else {
              return message.channel.send(":x: Type d'activité invalide")
            }

            let question2 = await message.channel.send("Quel nom voulez-vous attribuer à l'activité du bot ?")

            message.channel.awaitMessages({
              filter: filter,
              max: 1,
              time: 100000,
              errors: ['time']
            }).then(async (collected2) => {
              collected2.first().delete()
              question2.delete()
              BOTDB.update({ activity: collected2.first().content, activitytype: type}, { where: { id: BOTDB.id }});
              client.user.setActivity(collected2.first().content, { type: type, url: "https://www.twitch.tv/coinsbot" })
              update()
            });
          })
        }

        if (value == 'x') {
          m.delete()
        }
      })
      function update() {
        const embed = new Discord.EmbedBuilder()
          .setTitle(`**__Paramètres du profile du bot__**`)
          .setTimestamp()
          .setFooter({ text: `${client.user.username}` })
          .setDescription(`✏️・Changer le nom d'utilisateur\nActuel: ${client.user.username}\n\n🎬・Changer l'avatar\nActuel: [Clique ici](${client.user.displayAvatarURL()})\n\n📱・Changer l'activitée\nActuel: ${client.user.presence.activities[0] ? ` ${client.user.presence.activities[0].name}` : `:x:`}`)
        msg.edit({ embeds: [embed] })
      }
    });
  }
}

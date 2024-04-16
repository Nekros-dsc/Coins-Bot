const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message } = require('discord.js');
const color = require('../../base/functions/color');
const addCoins = require('../../base/functions/addCoins');
const { verifnum } = require('../../base/functions');

module.exports = {
  name: "drop",
  description: "Envois de l'argent à un autre joueur",
  usage: "drop 100 <#channel / none>",
  cooldown: 3,
  whitelist: true,
  aliases: ['dropmoney'],

  run: async (client, message, args) => {
    const embedColor = await color(message.member.id, message.guild.id, client, false)
    let gain = args[0]
    if (!args[0] || !verifnum(args[0])) return message.channel.send(`:clipboard: Pas de récompense précisée | drop <amount> <#channel/none>`);

    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
    if (!channel && channel !== "none") return message.channel.send(`:x: Je ne trouve pas ce salon | drop <amount> <#channel/none>`);

    message.channel.send(`*Drop lancé dans ${channel}*`);

    let button = new ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('claim').setLabel('Lancement en cours...').setDisabled(true)
    let button_row = new ActionRowBuilder().addComponents([button])
    const Embed = new EmbedBuilder()
      .setTitle(`🎉 Un colis tombe du ciel !`)
      .setColor(embedColor)
      .setDescription(`Cliques sur le boutton ci-dessous pour l'attraper et gagner \`${gain} coins\``)
      .setThumbnail('https://pixomoji.com/wp-content/plugins/pixomoji/assets/img/messenger/1F4E6.png')
      .setFooter({ text: "Expire au bout de 60 secondes" })
    channel.send({ embeds: [Embed], components: [button_row] }).then(msg => {
      let i = 3
      var interval = setInterval(function () {

        button_row.components[0].setLabel(`${i}`)

        msg.edit({ embeds: [Embed], components: [button_row] })
        i--
        if (i <= 0) {
          clearInterval(interval)
          button_row.components[0].setLabel("Go !").setEmoji('🏆').setDisabled(false)
          msg.edit({ embeds: [Embed], components: [button_row] })
          const collector = msg.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 60000
          })
          collector.on("collect", async (i) => {
            collector.stop()
            await i.deferUpdate()
            addCoins(i.user.id, message.guild.id, gain, "coins");
            channel.send(`🏆 <@${i.user.id}> a attrapé le colis ! Il vient de gagner \`${gain} coins\``)
          })

          collector.on("end", async () => {
            button_row.components[0].setDisabled(true);
            const Embedd = new EmbedBuilder()
              .setTitle(`Drop terminé`)
              .setColor(embedColor)
            return msg.edit({ embeds: [Embedd], components: [button_row] }).catch(() => { })
          })
          return
        }
      }, 1 * 1000);
    })

  }
}

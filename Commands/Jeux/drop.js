const Discord = require('discord.js');

exports.help = {
  name: 'drop',
  aliases: ['dropmoney'],
  description: 'Envois de l\'argent à un autre joueur',
  use: 'drop 100 <#channel / none>',
  perm: 'WHITELIST',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    const embedColor = await data.color
    let gain = args[0]
    if (!args[0] || !verifnum(args[0])) return message.channel.send(`:clipboard: Pas de récompense précisée | drop <amount> <#channel/none>`);

    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
    if (!channel && channel !== "none") return message.channel.send(`:x: Je ne trouve pas ce salon | drop <amount> <#channel/none>`);

    message.channel.send(`*Drop lancé dans ${channel}*`);

    let button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('claim').setLabel('Lancement en cours...').setDisabled(true)
    let button_row = new Discord.ActionRowBuilder().addComponents([button])
    const Embed = new Discord.EmbedBuilder()
      .setTitle(`🎉 Un colis tombe du ciel !`)
      .setColor(embedColor)
      .setDescription(`Cliques sur le boutton ci-dessous pour l'attraper et gagner \`${gain} coins\``)
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
            await bot.functions.addCoins(bot, message, args, i.user.id, gain, 'coins')
            channel.send(`🏆 <@${i.user.id}> a attrapé le colis ! Il vient de gagner \`${gain} coins\``)
          })

          collector.on("end", async () => {
            button_row.components[0].setDisabled(true);
            const Embedd = new Discord.EmbedBuilder()
              .setTitle(`Drop terminé`)
              .setColor(embedColor)
            return msg.edit({ embeds: [Embedd], components: [button_row] }).catch(() => { })
          })
          return
        }
      }, 1 * 1000);
    })
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
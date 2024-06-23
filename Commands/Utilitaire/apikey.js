const Discord = require('discord.js');

exports.help = {
  name: 'apikey',
  aliases: [],
  description: 'Envois la clef d\'API pour vous connecter aux coins de votre serveur ',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire',
  perm: 'BUYER'
}
exports.run = async (bot, message, args, config, data) => {
    let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('yes').setEmoji("✅").setLabel(`Oui`)

    let button_row = new Discord.ActionRowBuilder().addComponents([button_back])

    return message.reply({
        content: `:question: Êtes-vous sûr de vouloir regénérer la clef d'API du serveur ?`,
        components: [button_row],
        allowedMentions: { repliedUser: false }
    }).then(m => {

        const collector = m.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 30000
        })
        collector.on("collect", async (i) => {
            if (i) {
                if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ce bouton !", ephemeral: true }).catch(() => { })
                await i.deferUpdate()

                if (i.customId === 'yes') {
                    collector.stop()
                    let token = await gentoken()
                    bot.db.prepare(`UPDATE bot SET apikey = @coins WHERE id = @id`).run({ coins: token, id: bot.user.id});
                    return i.followUp({ content: `:key: La clef du serveur a été régénéré, la voici: ||\`${token}\`||`, ephemeral: true })
                } else {
                    collector.stop()
                }
            }
        })
        collector.on("end", async () => {
            button_row.components[0].setDisabled(true);
            return m.edit({ components: [button_row] }).catch(() => { })
        })
    })
}

function gentoken() { return [...Array(34)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') }
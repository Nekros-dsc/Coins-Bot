const Discord = require('discord.js')
const getUser = require('../functions/getUser');
const checkGuild = require('../functions/checkGuild');
const { Encheres } = require('../Database/Models/Encheres');
const color = require('../functions/color');

module.exports = {
    name: 'ready',

    run: async (client) => {
        setInterval(async () => {
            client.guilds.cache.forEach(async guild => {
                const encheres = await Encheres.findAll({
                    where: {
                        guildId: guild.id
                    }
                });
                for (actualenchere of encheres) {
                    const channel = guild.channels.cache.get(actualenchere.ChannelId);
                    if (!channel) return actualenchere.destroy()
                    let m = await channel.messages.fetch(actualenchere.MessageId)
                    if (!m) return actualenchere.destroy()
                    const expiredTime = Date.parse(actualenchere.datestart) + parseInt(actualenchere.duration)
                    const expired = expiredTime < Date.now();
                    let enchereTime = expiredTime / 1000

                    const button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId(`enchere-${m.id}`).setEmoji("🎉").setLabel(`${parseInt(actualenchere.lastenchere) + parseInt(actualenchere.click)}`.slice(0, 20))
                    const button_row = new Discord.ActionRowBuilder().addComponents([button])
                    const embedColor = await color(null, guild.id, client, false)
                    if (expired) {
                        actualenchere.destroy()
                        button_row.components[0].setDisabled(true);
                        m.edit({ components: [] }).catch(() => { })
                        let winnerid = actualenchere.encherisseur
                        if (!winnerid) return m.reply(`Personne n'a participé à cette enchère.`)
                        let winner = client.users.cache.get(winnerid)
                        if (!winner) return m.channel.send(`Je ne trouve pas le membre qui avait enchéri **${couu}** coins (<@${winnerid}>).`)
                        let lastPrice = actualenchere.lastenchere
                        m.reply(`**Félicitation à ${winner}, pour avoir gagné **${actualenchere.prize}** qui aura enchéri ${lastPrice} coins.**`)
                        let embedfinal = new Discord.EmbedBuilder()
                            .setTitle(actualenchere.prize)
                            .setColor(embedColor)
                            .setImage("https://media.discordapp.net/attachments/1002173915549937714/1051031533256982558/Ventes-aux-encheres-de-destockage.png?width=1440&height=613")
                            .setDescription(`Fin de l'enchère !
Terminée depuis <t:${enchereTime}:R> (<t:${enchereTime}>)
Lancée par: <@${actualenchere.author}>

Gagnant: ${winner}
Dernier prix: **${lastPrice} coins**`)
                            .setFooter({ text: `CoinsBot | Enchère terminée` })
                            .setTimestamp(expiredTime)
                        m.edit({ embeds: [embedfinal] })
                    }
                    let alreadyEnchere = actualenchere.encherisseur
                    alreadyEnchere = guild.members.cache.get(alreadyEnchere)
                    let couu = actualenchere.lastenchere
                    embed2 = new Discord.EmbedBuilder()
                        .setTitle(actualenchere.prize)
                        .setColor(embedColor)
                        .setImage("https://media.discordapp.net/attachments/1002173915549937714/1051031533256982558/Ventes-aux-encheres-de-destockage.png?width=1440&height=613")
                        .setDescription(`Réagissez avec :tada: pour enchérir !
Se termine <t:${enchereTime}:R> (<t:${enchereTime}>)
Lancée par: <@${actualenchere.author}>

${alreadyEnchere ? `Dernier enchérisseur: **${alreadyEnchere.user.username}**` : "Aucun enchérisseur"}
Dernier prix: **${couu} coins**
          
:warning: Le bot ne prend que vos coins en banque !`)
                        .setFooter({ text: `CoinsBot | Se termine` })
                        .setTimestamp(expiredTime)
                    m.edit({ embeds: [embed2], components: [button_row] })
                }
            })

        }, 3500)
    }

}
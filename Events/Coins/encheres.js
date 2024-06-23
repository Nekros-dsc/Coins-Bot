const Discord = require('discord.js')

module.exports = {
    name: 'ready',
    async execute(bot) {
        setInterval(async () => {
            bot.guilds.cache.forEach(async guild => {
                const encheres = bot.db.prepare('SELECT * FROM Encheres WHERE guildId = ?').all(guild.id)
                for (actualenchere of encheres) {
                    const deleteEnchere = bot.db.prepare('DELETE FROM Encheres WHERE num = ?')
                    const channel = guild.channels.cache.get(actualenchere.ChannelId);
                    if (!channel) return deleteEnchere.run(actualenchere.num)
                    let m = await channel.messages.fetch(actualenchere.MessageId)
                    if (!m) return deleteEnchere.run(actualenchere.num)
                    const expiredTime = Math.round(actualenchere.datestart) + Math.round(actualenchere.duration)
                    const expired = expiredTime < Date.now();
                    let enchereTime = expiredTime / 1000

                    const button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId(`enchere-${m.id}`).setEmoji("🎉").setLabel(`${parseInt(actualenchere.lastenchere) + parseInt(actualenchere.click)}`.slice(0, 20))
                    const button_row = new Discord.ActionRowBuilder().addComponents([button])
                    const embedColor = bot.functions.checkGuild(bot, null, guild.id).color
                    if (expired) {
                        deleteEnchere.run(actualenchere.num)
                        button_row.components[0].setDisabled(true);
                        m.edit({ components: [] }).catch(() => { })
                        let winnerid = actualenchere.encherisseur
                        if (!winnerid) return m.reply(`Personne n'a participé à cette enchère.`)
                        let winner = bot.users.cache.get(winnerid)
                        if (!winner) return m.channel.send(`Je ne trouve pas le membre qui avait enchéri **${couu}** coins (<@${winnerid}>).`)
                        let lastPrice = actualenchere.lastenchere
                        m.reply(`**Félicitation à ${winner}, pour avoir gagné **${actualenchere.prize}** qui aura enchéri ${lastPrice} coins.**`)
                        let embedfinal = new Discord.EmbedBuilder()
                            .setTitle(actualenchere.prize)
                            .setColor(embedColor)
                            .setImage("https://media.discordapp.net/attachments/1249042420163674153/1250413094522454047/Ventes-aux-encheres-de-destockage.png?ex=666ad971&is=666987f1&hm=dda30366d2d5da347da01f67768972cc40d9dec268c4ab42832ac4538855c4ea&=&format=webp&quality=lossless&width=3360&height=1429")
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
Se termine <t:${Math.round(enchereTime)}:R> (<t:${Math.round(enchereTime)}>)
Lancée par: <@${actualenchere.author}>

${alreadyEnchere ? `Dernier enchérisseur: **${alreadyEnchere.user.username}**` : "Aucun enchérisseur"}
Dernier prix: **${Math.round(couu)} coins**
          
:warning: Le bot ne prend que vos coins en banque !`)
                        .setFooter({ text: `CoinsBot | Se termine` })
                        .setTimestamp(expiredTime)
                    m.edit({ embeds: [embed2], components: [button_row] })
                }
            })

        }, 3500)
    }

}
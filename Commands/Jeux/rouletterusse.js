const Discord = require('discord.js');

exports.help = {
  name: 'rouletterusse',
  aliases: ['rouletter'],
  description: 'Lance une roulette russe',
  use: 'rouletterusse <amount>',
  category: 'Jeux'
}
exports.run = async (bot, message, args, config, data) => {
    let users = [];
    const time = Math.floor((Date.now() + 5 * 60 * 1000) / 1000)
    if(isNaN(args[0])) return message.reply(`:clipboard: Pas de récompense précisée | rouletterusse <amount>`)
    if(JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins < parseInt(args[0])) return message.reply(`:x: Vous n'avez pas assez de coins (\`${JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins}\`)`)
    users.push({ id: message.author.id, emoji: ""})
    bot.functions.removeCoins(bot, message, args, message.author.id, args[0], 'coins')
    let buttonJoin = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('joinGame').setLabel("Rejoindre la partie")
    let buttonStart = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('startGame').setLabel("Lancer la partie")
    let button_row = new Discord.ActionRowBuilder().addComponents([buttonJoin, buttonStart])

    const msg = await message.reply({ embeds: [embed(bot, message, args, data, users, time)], components: [button_row]})

    const collector = msg.createMessageComponentCollector({ time: 5 * 60 * 1000 });

    collector.on('collect', async (i) => {
        if(i.customId == "joinGame") {
            const verif = users.filter(u => u.id == i.user.id)
            if(verif.length !== 0) return i.reply({ ephemeral: true, content: `:x: Vous participez déjà à ce jeu` })
            else {
                if(JSON.parse(bot.functions.checkUser(bot, message, args, i.user.id).coins).coins < parseInt(args[0])) return i.reply({ content: `:x: Vous n'avez pas assez de coins (\`${JSON.parse(bot.functions.checkUser(bot, message, args, i.user.id).coins).coins}\`)`, ephemeral: true })
                bot.functions.removeCoins(bot, message, args, i.user.id, args[0], 'coins')
                users.push({ id: i.user.id, emoji: ""})
                i.reply({ content: `:white_check_mark: Vous avez rejoins la partie avec succès !`, ephemeral: true })
                msg.edit({ embeds: [embed(bot, message, args, data, users, time)] })
            }
        } else if(i.customId == "startGame") {
            if(i.user.id !== message.author.id) return i.reply({ content: `❌ Vous n'avez pas la permission de lancer la partie !`, ephemeral: true })
            else i.reply({ content: `Lancement de la partie !`, ephemeral: true }), collector.stop()
        }
    })

    collector.on('end', async () => {
        if(users.length < 2) return msg.edit({ content: `Pas assez de joueurs ! (<3)` }),  bot.functions.addCoins(bot, message, args, message.author.id, parseInt(args[0]), 'coins')
        else {
            msg.edit({ content: `Partie lancée` })
            const msg2 = await message.channel.send({ embeds: [embed(bot, message, args, data, users, time).setThumbnail(null).setImage(`https://media.discordapp.net/attachments/1249042420163674153/1250865162001453127/JGSn.gif?ex=666c7e76&is=666b2cf6&hm=ac854ce279d77c3c0dfd4c345498793ffb9221424855f1aabae77509f127477a&=&width=683&height=395`).setDescription(`${users.map(u => `- <@${u.id}>`).join('\n')}`).setTitle(`🎡 Roulette Russe en cours !`)]})
            let i = 0, mort
            const randomNumber = Math.floor(Math.random() * ((users.length - 1) - 0 + (users.length - 1)) + 0)
            mort = users[randomNumber].id
            const intervalle = setInterval(() => {
                if(users.length == i) clearInterval(intervalle);
                else {
                    if(mort == users[i].id) users[i].emoji = ":skull:"
                    else users[i].emoji = ":heart:"
                    i++
                    msg2.edit({ embeds: [embed(bot, message, args, data, users, time).setThumbnail(null).setImage(`https://media.discordapp.net/attachments/1249042420163674153/1250865162001453127/JGSn.gif?ex=666c7e76&is=666b2cf6&hm=ac854ce279d77c3c0dfd4c345498793ffb9221424855f1aabae77509f127477a&=&width=683&height=395`).setDescription(`${users.map(u => `- <@${u.id}> ${u.emoji}`).join('\n')}`).setTitle(`🎡 Roulette Russe en cours !`)]})
                    if(i == users.length) {
                        const repartition = Math.round(args[0] / users.length - 1)
                        msg2.edit({ embeds: [embed(bot, message, args, data, users, time).setThumbnail(null).setImage(`https://media.discordapp.net/attachments/1249042420163674153/1250865162001453127/JGSn.gif?ex=666c7e76&is=666b2cf6&hm=ac854ce279d77c3c0dfd4c345498793ffb9221424855f1aabae77509f127477a&=&width=683&height=395`).setDescription(`${users.map(u => `- <@${u.id}> ${u.emoji}`).join('\n')}`).setTitle(`🎡 Roulette Russe en cours !`).addFields({ name: `Fin de la partie !`, value: `Les \`${args[0]} coins\` de <@${mort}> vont être départagés entre les autres joueurs (**${repartition} / joueur**)`})]})
                        users.forEach(u => {
                            if(mort == u.id) return
                            bot.functions.addCoins(bot, message, args, u.id, parseInt(args[0]) + repartition, 'coins')
                        })
                    }
                }   
            }, 1000)
        }
    })
}

function embed(bot, message, args, data, users, time) {
    const embed = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setFooter({ text: `Lancé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
    .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1250865082712326204/JHtz.gif?ex=666c7e63&is=666b2ce3&hm=ba95322c18d1ee9262b94f03f65da3ee5329e4b15201179c3d3938aa41a40579&=&width=863&height=539`)
    .setTitle(`🎡 Roulette Russe !`)
    .setDescription(`Mise: \`${args[0]}\` | Lancement automatique: <t:${time}:R>\n\n(${users.length}/10) **Joueurs dans la partie:**\n${users.map(u => `- <@${u.id}> a rejoint la partie`).join('\n')}`)

    return embed
}
const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'cambriolage',
  aliases: [],
  description: 'Cambriole l\'entrepot d\'un membre',
  use: 'Pas d\'utilisation conseillée',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).cambriolage;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    if (memberDB.metier === "cambrioleur") {
        if (cooldownsReputation.has(message.author.id)) {
            const cooldownExpiration = cooldownsReputation.get(message.author.id) + cooldownTime;
            const remainingCooldown = cooldownExpiration - Math.floor(Date.now() / 1000);
    
            if (remainingCooldown > 0) {
                const hours = Math.floor(remainingCooldown / 3600);
                const minutes = Math.floor((remainingCooldown % 3600) / 60);
                const seconds = Math.floor(remainingCooldown % 60);
    
                const CouldownEmbed = new Discord.EmbedBuilder()
                .setDescription(`🕐 Vous avez déjà \`braquage\` récemment\n\nRéessayez dans${hours > 0 ? ` ${hours} heures` : ""}${minutes > 0 ? ` ${minutes} minutes`: ""}${seconds > 0 ? ` ${seconds} secondes` : ""}`)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor(data.color)
    
                return message.reply({ embeds: [CouldownEmbed] });
            }
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user || user.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        let targetuser = bot.functions.checkUser(bot, message, args, user.id)
        if (targetuser.antirob > Date.now()) {
            
            let timeEmbed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:shield: Vous ne pouvez pas cambrioler cet utilisateur\n\n Son anti-rob prendra fin <t:${Math.floor(targetuser.antirob / 1000)}:R> `)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
        } else {
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
            let maxentrepot = JSON.parse(data.gain).entrepotMax
            let total = JSON.parse(targetuser.batiment).coins 
            if (parseInt(total) > parseInt(maxentrepot)) {
                const json = {
                    "count": maxentrepot,
                    "batiments": JSON.parse(memberDB.batiment).batiments
                }
                bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
                total = maxentrepot
            }

            let moneyEmbed2 = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: **${user.user.username}** n'a rien ou pas assez à cambrioler (${total}) !`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
            if (!total || total <= 100) return message.channel.send({ embeds: [moneyEmbed2] })

            const checkif = between(1, 3)
            if (checkif === 2) {
                return message.channel.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:city_sunset: Vous n'avez pas réussi à cambrioler **${user.user.username}** !`)
                        .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249831355211321415/J9pS.gif?ex=6668bba7&is=66676a27&hm=c2ca988bb2612ea5c4d069d71c5164b7a999494a27941b2303ef274b7f9dd213&=&width=539&height=359')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                })
            }
            let random = between(100, parseInt(total))


            let embed = new Discord.EmbedBuilder()
                .setDescription(`:white_check_mark: Vous avez cambriolé ${user} et repartez avec \`${random} coins\` en plus`)
                .setColor(data.color)
                .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249831822851047535/A3Gz.gif?ex=6668bc17&is=66676a97&hm=eba0424a48d0335590d6b9574ce9734c3ac944e4253ed6c28f625acdaf4ee3d2&=&width=800&height=449')
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
            message.reply({ embeds: [embed] })
            const json = {
                "count": maxentrepot - random,
                "batiments": JSON.parse(memberDB.batiment).batiments
            }
            bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: user.id});
            bot.functions.addCoins(bot, message, args, message.author.id, random, 'coins')
        };

    } else {
        return message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous devez être **cambrioleur** pour utiliser cette commande !`)]
        })
    }
}

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
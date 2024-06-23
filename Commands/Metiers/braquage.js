const Discord = require('discord.js');

const cooldownsReputation = new Map();

exports.help = {
  name: 'braquage',
  aliases: [],
  description: 'Braque la banque d\'un autre joueur ',
  use: 'Pas d\'utilisation conseillée',
  category: 'Metier'
}
exports.run = async (bot, message, args, config, data) => {
    const cooldownTime = JSON.parse(data.time).braquage;
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
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
    if (memberDB.metier === "braqueur") {
        if (message.mentions.members.first() || !isNaN(args[0])) {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user || user.user.bot || user.id == message.member.id) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            let targetuser = bot.functions.checkUser(bot, message, args, user.id)
            if (targetuser.antirob > Date.now()) {
                
                let timeEmbed = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:shield: Vous ne pouvez pas braquer cet utilisateur\n\n Son anti-rob prendra fin <t:${Math.floor(targetuser.antirob / 1000)}:R> `)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
            } else {
                cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
                let moneyEmbed2 = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: **${user.user.username}** n'a pas d'argent à braquer !`)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                if (!JSON.parse(targetuser.coins).bank || parseInt(JSON.parse(targetuser.coins).bank) <= 6) {
                    return message.reply({ embeds: [moneyEmbed2], allowedMentions: { repliedUser: false } })
                }
                const checkif = between(1, 3)
                if (checkif === 2 || checkif === 3) {
                    return message.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:bank: Vous n'avez pas réussi à braquer **${user.user.username}** !`)
                            .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249802614175174759/braquages-rigolos-17.gif?ex=6668a0e3&is=66674f63&hm=b1f5345d2dcce271b68aa3bd6420aa2bc156c322a914c9583cfe72119841691d&=&width=935&height=575')
                            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
                    })
                }


                let random = between(6, parseInt(JSON.parse(targetuser.coins).bank))

                random = random / 3
                random = Math.round(random)
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`:white_check_mark: Vous avez braqué ${user} et repartez avec \`${random} coins\` en plus`)
                    .setColor(data.color)
                    .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249820639813177446/tenor.gif?ex=6668b1ad&is=6667602d&hm=530675ae3d1035cf8ac579812004f45ed55e22ce4b193a13fbb511d35d26ef18&=&width=896&height=500')
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

                bot.functions.removeCoins(bot, message, args, targetuser.id, random, 'bank')
                bot.functions.addCoins(bot, message, args, message.author.id, random, 'coins')
            }
        } else {
            let authorteam = bot.functions.checkTeam(bot, message, args, args[0])
            if (!authorteam?.id) return message.channel.send(`:x: Pas de team trouvé avec le nom \`${args[0]}\` !`.replaceAll("@", "a"))
            cooldownsReputation.set(message.author.id, Math.floor(Date.now() / 1000));
            if (authorteam.cadenas > 0) {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`:lock: La team ${authorteam.id} lui reste **${authorteam.cadenas} cadena(s)** qui la protège des braquages !`)
                    .setColor(data.color)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            }
            let bank = parseInt(authorteam.coins)
            if (!bank || bank <= 29) message.reply({ content: `:x: La team ${authorteam.id} n'a pas assez de coins pour être braqué !`, allowedMentions: { repliedUser: false } })
            const checkiff = between(1, 3)

            if (checkiff === 2 || checkiff === 3) {
                return message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:bank: Vous n'avez pas réussi à braquer la team ${authorteam.id} !`)
                        .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249802614175174759/braquages-rigolos-17.gif?ex=6668a0e3&is=66674f63&hm=b1f5345d2dcce271b68aa3bd6420aa2bc156c322a914c9583cfe72119841691d&=&width=935&height=575')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
                })
            }

            let gain = between(30, bank)
            gain = gain / 3
            gain = Math.round(gain)
            let embed = new Discord.EmbedBuilder()
                .setDescription(`:white_check_mark: Vous avez braqué la team ${authorteam.id} et repartez avec \`${gain} coins\` en plus`)
                .setColor(data.color)
                .setImage('https://media.discordapp.net/attachments/1249042420163674153/1249820639813177446/tenor.gif?ex=6668b1ad&is=6667602d&hm=530675ae3d1035cf8ac579812004f45ed55e22ce4b193a13fbb511d35d26ef18&=&width=896&height=500')
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            bot.db.prepare(`UPDATE team SET coins = @coins WHERE id = @id`).run({ coins: bank - gain, id: args[0] });
            bot.functions.addCoins(bot, message, args, message.author.id, gain, 'coins')
        }
    } else {
        return message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous devez être **braqueur** pour utiliser cette commande !`)]
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
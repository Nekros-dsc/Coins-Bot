const Discord = require("discord.js");
const setCooldown = require("../../base/functions/setCooldown");
const getUser = require("../../base/functions/getUser");
const userTeam = require("../../base/functions/teams/userTeam");
const { between } = require("../../base/functions");
module.exports = {
    name: "braquage",
    description: "Braque la banque d'un autre joueur",
    aliases: ["tbraquage"],

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        if (memberDB.Metier === "braqueur") {
            if (message.mentions.members.first() || !isNaN(args[0])) {
                let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
                if (!user || user.user.bot || user.id == message.member.id) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
                let targetuser = await getUser(user.id, message.guild.id)
                let cool = await setCooldown(message, data.color, user.id, message.guild.id, "antirob", 7200000, true, true)
                if (!cool[0] && cool !== true && cool.length && cool[1]) {

                    let timeEmbed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:shield: Vous ne pouvez pas braquer cet utilisateur\n\n Son anti-rob prendra fin dans ${cool[1]} `)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
                } else {
                    let moneyEmbed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: **${user.user.username}** n'a pas d'argent à braquer !`)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    if (!targetuser.Bank || parseInt(targetuser.Bank) <= 6) {
                        return message.reply({ embeds: [moneyEmbed2], allowedMentions: { repliedUser: false } })
                    }
                    if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "braquage", 13000000))) return
                    const checkif = between(1, 3)
                    if (checkif === 2 || checkif === 3) {
                        return message.reply({
                            embeds: [new Discord.EmbedBuilder()
                                .setColor(data.color)
                                .setDescription(`:bank: Vous n'avez pas réussi à braquer **${user.user.username}** !`)
                                .setImage('https://www.kiffland.fr/pictures/images_series/062014/braquages-rigolos-17.gif')
                                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
                        })
                    }


                    let random = between(6, parseInt(targetuser.Bank))

                    random = random / 3
                    random = Math.round(random)
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`:white_check_mark: Vous avez braqué ${user} et repartez avec \`${random} coins\` en plus`)
                        .setColor(data.color)
                        .setImage('https://media1.tenor.com/images/5f3179cea7af4b2859a5e3db6ea900d5/tenor.gif?itemid=10879740')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

                    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Vous avez braqué \`${user.user.tag}\` un total de \`\`${random} coins\`\``)
                    //db.push(`${message.guild.id}_${user.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: \`${message.author.tag}\` vous a braqué \`\`${random} coins\`\``)
                    targetuser.decrement('Bank', { by: random });
                    memberDB.increment('Coins', { by: random });
                }
            } else {
                let authorteam = await userTeam(false, message.guild.id, args[0])
                if (!authorteam) return message.channel.send(`:x: Pas de team trouvé avec le nom \`${args[0]}\` !`.replaceAll("@", "a"))
                if (authorteam.cadenas > 0) {
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`:lock: La team ${authorteam.name} lui reste **${authorteam.cadenas} cadena(s)** qui la protège des braquages !`)
                        .setColor(data.color)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                }
                let bank = parseInt(authorteam.coins)
                if (!bank || bank <= 29) message.reply({ content: `:x: La team ${team} n'a pas assez de coins pour être braqué !`, allowedMentions: { repliedUser: false } })
                if (!(await setCooldown(message, data.color, message.member.id, message.guild.id, "braquage", 13000000))) return
                const checkiff = between(1, 3)

                if (checkiff === 2 || checkiff === 3) {
                    return message.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:bank: Vous n'avez pas réussi à braquer la team ${authorteam.name} !`)
                            .setImage('https://www.kiffland.fr/pictures/images_series/062014/braquages-rigolos-17.gif')
                            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
                    })
                }

                let gain = between(30, bank)
                gain = gain / 3
                gain = Math.round(gain)
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`:white_check_mark: Vous avez braqué la team ${authorteam.name} et repartez avec \`${gain} coins\` en plus`)
                    .setColor(data.color)
                    .setImage('https://media1.tenor.com/images/5f3179cea7af4b2859a5e3db6ea900d5/tenor.gif?itemid=10879740')
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                authorteam.decrement('coins', { by: gain });
                memberDB.increment('Coins', { by: gain });
            }
        } else {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous devez être **braqueur** pour utiliser cette commande !`)]
            })
        }


    }
}

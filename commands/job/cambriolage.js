const Discord = require("discord.js");
const { between } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");

module.exports = {
    name: "cambriolage",
    description: "Cambriole l'entrepot d'un membre",

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        if (memberDB.Metier === "cambrioleur") {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user || user.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            let targetuser = await getUser(user.id, message.guild.id)
            let cool = await setCooldown(message, data.color, user.id, message.guild.id, "antirob", 7200000, true, true)
            if (!cool[0] && cool !== true && cool.length) {

                let timeEmbed = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:shield: Vous ne pouvez pas cambrioler cet utilisateur\n\n Son anti-rob prendra fin dans ${cool[1]} `)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
            } else {
                if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "cambriolage", 36000000, true))) return
                let maxentrepot = data.guild.Max["entrepot"] || 5000
                let total = targetuser.Entrepot || 0
                if (parseInt(total) > parseInt(maxentrepot)) {
                    targetuser.update({ Entrepot: maxentrepot }, { where: { primary: targetuser.primary }});
                    total = maxentrepot
                }

                let moneyEmbed2 = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: **${user.user.username}** n'a rien ou pas assez à cambrioler (${total}) !`)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                if (!total || total <= 100) return message.channel.send({ embeds: [moneyEmbed2] })

                if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "cambriolage", 36000000))) return

                const checkif = between(1, 3)
                if (checkif === 2) {
                    return message.channel.send({
                        embeds: [new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:city_sunset: Vous n'avez pas réussi à cambrioler **${user.user.username}** !`)
                            .setImage('https://i.gifer.com/J9pS.gif')
                            .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                    })
                }
                let random = between(100, parseInt(total))


                let embed = new Discord.EmbedBuilder()
                    .setDescription(`:white_check_mark: Vous avez cambriolé ${user} et repartez avec \`${random} coins\` en plus`)
                    .setColor(data.color)
                    .setImage('https://i.gifer.com/A3Gz.gif')
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
                message.reply({ embeds: [embed] })

                //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Vous avez cambriolé \`${user.user.tag}\` un total de \`\`${random} coins\`\``)
                //db.push(`${message.guild.id}_${user.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: \`${message.author.tag}\` vous a cambriolé \`\`${random} coins\`\``)

                targetuser.decrement('Entrepot', { by: random });
                memberDB.increment('Coins', { by: random });
            };

        } else {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous devez être **cambrioleur** pour utiliser cette commande !`)]
            })
        }
    }
}
const Discord = require("discord.js");
const { between } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");

module.exports = {
    name: "kill",
    description: "Commande du métier tueur",

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        if (memberDB.Metier === "tueur") {
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "kill", 18000000, true))) return
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user || user.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })

            let targetuser = await getUser(user.id, message.guild.id)
            let cool = await setCooldown(message, data.color, user.id, message.guild.id, "antirob", 7200000, true, true)
                if (!cool[0] && cool !== true && cool.length) {

                    let timeEmbed = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:shield: Vous ne pouvez pas tuer cet utilisateur\n\n Son anti-rob prendra fin dans ${cool[1]} `)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
                } else {


                    let moneyEmbed2 = new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:x: **${user.user.username}** vous ne gagnerez rien si vous tuez cette personne !`)
                        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });

                    if (!targetuser.Rep || parseInt(targetuser.Rep) <= 2) return message.channel.send({ embeds: [moneyEmbed2] })

                    const checkif = between(1, 2)
                    if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "kill", 18000000))) return
                    if (checkif === 2) {
                        return message.channel.send({
                            embeds: [new Discord.EmbedBuilder()
                                .setColor(data.color)
                                .setDescription(`:bank: Vous n'avez pas réussi à tuer **${user.user.username}** !`)
                                .setImage('http://acidcow.com/pics/20140616/robbers_losers_04.gif')
                                .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                        })
                    }




                    let random = between(1, 2)


                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`:white_check_mark: Vous avez tué ${user} et repartez avec \`${random} rep\` en plus`)
                        .setColor(data.color)
                        .setImage('https://c.tenor.com/F__GSvFsf20AAAAC/among-us-kill.gif')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
                    message.channel.send({ embeds: [embed] })
                    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :small_red_triangle: Vous avez kill \`${user.user.tag}\` un total de \`\`${random} rep\`\``)
                    //db.push(`${message.guild.id}_${user.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :small_red_triangle_down: \`${message.author.tag}\` vous a kill \`\`${random} rep\`\``)
                    authorteam.decrement('Rep', { by: random });
                    memberDB.increment('Rep', { by: random });

                };
        } else {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous devez être **tueur** pour utiliser cette commande !`)]
            })
        }


    }
}
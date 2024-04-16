const Discord = require("discord.js");
const { between } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
    name: "hack",
    description: "Commande du métier hacker",
    usage: "hack <team id>",

    run: async (client, message, args, data) => {
        let memberDB = await getUser(message.member.id, message.guild.id)
        if (memberDB.Metier === "hacker") {
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "hack", 7200000, true))) return
            if (!args[0]) return message.reply({ content: ":x: `ERROR:` Veuillez mentionner un membre ou préciser l'ID d'une team !", allowedMentions: { repliedUser: false } })
            let authorteam = await userTeam(false, message.guild.id, args[0])
            if (!authorteam) return message.channel.send(`:x: Pas de team trouvé avec le nom \`${args[0]}\` !`.replaceAll("@", "a"))

            let finallb = Object.entries(authorteam.members)
            const memberData = finallb.find(([id]) => id === message.member.id)
            if (memberData) return message.reply(`:x: Vous ne pouvez pas hack votre team !`)

            let moneyEmbed2 = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: La team \`${authorteam.name}\` n'a plus de cadenas !`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });

            if (parseInt(authorteam.cadenas) <= 0) return message.channel.send({ embeds: [moneyEmbed2] })

            const checkif = between(1, 2)
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "hack", 7200000))) return
            if (checkif === 2) {
                return message.channel.send({
                    embeds: [new Discord.EmbedBuilder()
                        .setColor(data.color)
                        .setDescription(`:bank: Vous n'avez pas réussi à hack la team \`${authorteam.name}\` !`)
                        .setImage('https://media4.giphy.com/media/YQitE4YNQNahy/giphy-downsized-large.gif')
                        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` })]
                })
            }


            let embed = new Discord.EmbedBuilder()
                .setDescription(`:white_check_mark: Vous avez hack la team \`${authorteam.name}\` !`)
                .setColor(data.color)
                .setImage('https://giffiles.alphacoders.com/209/209037.gif')
                .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
            message.channel.send({ embeds: [embed] })

            authorteam.decrement('cadenas', { by: 1 });

        } else {
            return message.channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous devez être **hacker** pour utiliser cette commande !`)]
            })
        }

    }
}
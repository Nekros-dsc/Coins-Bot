const Discord = require("discord.js");
const { webhook, wlog, between } = require("../../base/functions");
const setCooldown = require("../../base/functions/setCooldown");
const getUser = require("../../base/functions/getUser");
module.exports = {
    name: "rob",
    usage: "rob <@user>",
    description: "Vole l'argent de la main d'un autre joueur",

    run: async (client, message, args, data) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
        let targetuser = await getUser(user.id, message.guild.id)
        let cool = await setCooldown(message, data.color, user.id, message.guild.id, "antirob", 7200000, true, true)
        if (!cool[0] && cool !== true && cool.length && cool[1] !== undefined) {
            
            let timeEmbed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:shield: Vous ne pouvez pas rob cet utilisateur\n\n Son anti-rob prendra fin dans ${cool[1]} `)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
        } else {
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "rob", 3600000, true))) return
            let moneyEmbed0 = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous ne pouvez pas vous rob vous-même !`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if (message.author.id === user.user.id) return message.reply({ embeds: [moneyEmbed0], allowedMentions: { repliedUser: false } })

            let moneyEmbed2 = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: ${user.user.username} n'a pas d'argent à voler !`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if (parseInt(targetuser.Coins) <= 1 || !targetuser.Coins) {
                return message.reply({ embeds: [moneyEmbed2], allowedMentions: { repliedUser: false } })
            }
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "rob", 3600000))) return
            const checkif = between(0, 3)
            if (checkif === 2) {
                let fail = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(` Vous n'avez pas réussi à rob ${user.user.username} !`)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [fail], allowedMentions: { repliedUser: false } })
            }

            let random = between(1, parseInt(targetuser.Coins))

            let embed = new Discord.EmbedBuilder()
                .setDescription(`:white_check_mark: Vous avez volé ${user} et repartez avec \`${random} coins\` en plus`)
                .setColor(data.color)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

            //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Vous avez volé \`${user.user.tag}\` un total de \`\`${random} coins\`\``)
            //db.push(`${message.guild.id}_${user.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: \`${message.author.tag}\` vous a volé \`\`${random} coins\`\``)

            wlog(message.author, "GREEN", message.guild, `${message.author.tag} vient de voler \`\`${random} coins\`\` à ${user.user.tag}`, "Rob")
            wlog(user.user, "RED", message.guild, `${user.user.tag} vient de se faire voler \`\`${random} coins\`\` par ${message.author.tag}`, "Rob")
            targetuser.decrement('Coins', { by: random });
            let authorDB = await getUser(message.member.id, message.guild.id)
            if (authorDB) authorDB.increment('Coins', { by: random });

        };


    }
}
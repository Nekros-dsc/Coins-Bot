const Discord = require("discord.js");
const { wlog, verifnum } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const addCoins = require("../../base/functions/addCoins");
const removeCoins = require("../../base/functions/removeCoins");

module.exports = {
    name: "pay",
    usage: "pay <user> <amount/all>",
    description: "Envois de l'argent à un autre joueur",

    run: async (client, message, args, data) => {
        client.queue.addJob(async (cb) => {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member || member.user.bot) {
                cb()
                return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })}

            if (member.user.id === message.author.id) {cb()
                return message.reply({ content: ":x: Vous ne pouvez pas vous envoyer de l'argent !", allowedMentions: { repliedUser: false } })}
            let amount = args[1]
            let bal = (await getUser(message.member.id, message.guild.id)).Coins
            if (!amount) {cb()
                return message.reply({ content: `:x: Merci de préciser un montant à payer`, allowedMentions: { repliedUser: false } })}
            if (!verifnum(amount)) {cb()
                return message.reply({ content: `:x: Ceci n'est pas un chiffre valide !`, allowedMentions: { repliedUser: false } })}
            amount = parseInt(amount)
            let embedbank = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(":x: Vous n'avez pas d'argent à payer !")
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            let embed3 = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous ne pouvez pas payer un montant négatif`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })

            if (amount <= 0) {
                cb()
                return message.reply({ embeds: [embed3], allowedMentions: { repliedUser: false } })
            }
            if (bal === 0){cb()
                 return message.reply({ embeds: [embedbank], allowedMentions: { repliedUser: false } })}

            let moneymore = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setDescription(`:x: Vous n'avez pas assez de coins`)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if (amount > bal) {cb()
                return message.reply({ embeds: [moneymore], allowedMentions: { repliedUser: false } });}

            addCoins(member.id, message.guild.id, amount, "coins");
            removeCoins(message.member.id, message.guild.id, amount, "coins");
            cb()
            message.reply({ content: `:coin: Vous venez de payer \`${member.user.tag}\` un montant de \`\`${amount} coins\`\``, allowedMentions: { repliedUser: false } })
            //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Vous avez payé \`${member.user.tag}\` un montant de \`\`${amount} coins\`\``)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: \`${message.author.tag}\` vous a payé \`\`${amount} coins\`\``)
            wlog(message.author, "RED", message.guild, `${message.author.tag} vient de payer \`\`${amount} coins\`\``, "Paye " + member.user.tag)
        })
    }
}
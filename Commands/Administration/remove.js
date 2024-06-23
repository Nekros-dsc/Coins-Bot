const Discord = require('discord.js');

exports.help = {
  name: 'remove',
  aliases: [],
  description: 'Retire des biens à un joueur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    if (JSON.parse(data.blockedCommandAdmin) == "on") return message.channel.send(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot ! `)

    if (args[0] == 'banque') {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member) return message.reply(":warning: Utilisateur Invalide")
        let amount = args[2]
        if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
        if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)


        bot.functions.removeCoins(bot, message, args, member.id, amount, 'bank')

        message.channel.send(`:bank: Vous venez de de retirer à ${member.user.username} un montant de \`${amount} coins\` en banque`)
        await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:red_circle: ${message.author.username} vous a retiré \`${amount} coins\` dans votre banque`}, 'mail')
    }
    else if (args[0] == 'rep') {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member) return message.reply(":warning: Utilisateur Invalide")
        let amount = args[2]
        if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
        if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

        bot.functions.removeCoins(bot, message, args, member.id, amount, 'rep')

        message.channel.send(`:small_red_triangle: Vous venez de de retirer à ${member.user.username} un montant de \`${amount} rep\``)
        await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:red_circle: ${message.author.username} vous a retiré \`${amount} rep\``}, 'mail')

    } else {
        if (args[0] === "team") {
            let team = await bot.functions.checkTeam(bot, message, args, args[2])
            if (!team) return message.channel.send(`:x: Team introuvable !`)

            if (args[1] === "rep") {

                let amount = args[3]
                if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
                if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                bot.functions.removeteam(bot, message, args, args[2], amount, "rep")

                message.channel.send(`:small_red_triangle: Vous venez de de retirer a la team **${team.name}** un montant de \`${amount} rep\``)
            } else {
                let amount = args[3]
                if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
                if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                bot.functions.removeteam(bot, message, args, args[2], amount, "coins")

                message.channel.send(`:coin: Vous venez de de retirer a la team **${team.name}** un montant de \`${amount} coins\``)

            }
        } else {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member)
                return message.reply(":warning: Utilisateur Invalide")

            let amount = args[1]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

            bot.functions.removeCoins(bot, message, args, member.id, amount, 'coins')

            message.channel.send(`:coin: Vous venez de de retirer à ${member.user.username} un montant de \`${amount} coins\``)
            bot.functions.checkLogs(bot, message, args, message.guild.id, `:warning: ${message.author.username} vient de retiré \`10 coins\` à ${member.user.username}`, 'add', 'Orange', 'Remove')
            await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:red_circle: ${message.author.username} vous a retiré \`${amount} coins\``}, 'mail')
        }

    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
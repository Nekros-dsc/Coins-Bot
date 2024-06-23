const Discord = require('discord.js');

exports.help = {
  name: 'add',
  aliases: [],
  description: 'Pour ajouter des coins',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config2, data) => {
    if (JSON.parse(data.blockedCommandAdmin) == "on") return message.channel.send(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot ! `)

    if (args[0] == 'banque') {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member) return message.reply(":warning: Utilisateur Invalide")
        let amount = args[2]
        if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
        if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)


        bot.functions.addCoins(bot, message, args, member.id, amount, 'bank')

        message.channel.send(`:bank: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} coins\` en banque`)
        await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:green_circle: ${message.author.username} vous a ajouté \`${amount} coins\` dans votre banque`}, 'mail')
    }
    else if (args[0] == 'rep') {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!member) return message.reply(":warning: Utilisateur Invalide")
        let amount = args[2]
        if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
        if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

        bot.functions.addCoins(bot, message, args, member.id, amount, 'rep')

        message.channel.send(`:small_red_triangle: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} rep\``)
        await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:green_circle: ${message.author.username} vous a ajouté \`${amount} rep\``}, 'mail')

    } else {
        if (args[0] === "team") {
            let team = await bot.functions.checkTeam(bot, message, args, args[2])
        if (!team) return message.channel.send(`:x: Team introuvable !`)

            if (args[1] === "rep") {

                let amount = args[3]
                if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
                if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                bot.functions.addTeam(bot, message, args, args[2], amount, "rep")

                message.channel.send(`:small_red_triangle: Vous venez de d'ajouter a la team **${team.name}** un montant de \`${amount} rep\``)
            } else {
                let amount = args[3]
                if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
                if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                bot.functions.addTeam(bot, message, args, args[2], amount, "coins")

                message.channel.send(`:coin: Vous venez de d'ajouter a la team **${team.name}** un montant de \`${amount} coins\``)

            }
        } else {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member)
                return message.reply(":warning: Utilisateur Invalide")

            let amount = args[1]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

            bot.functions.addCoins(bot, message, args, member.id, amount, 'coins')

            message.channel.send(`:coin: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} coins\``)
            await bot.functions.addCoins(bot, message, args, member.user.id, { timestamp: Math.floor(Date.now() / 1000), message: `:green_circle: ${message.author.username} vous a ajouté \`${amount} coins\``}, 'mail')
            bot.functions.checkLogs(bot, message, args, message.guild.id, `:warning: ${message.author.username} vient d'ajouter \`${amount} coins\` à ${member.user.username}`, 'add', 'Green', 'Add Coins')
    }
    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
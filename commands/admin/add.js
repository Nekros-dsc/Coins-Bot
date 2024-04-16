const { wlog, wl, webhook, verifnum } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
    name: "add",
    description: "Pour ajouter des coins",
    cooldown: 2,
    whitelist: true,
    run: async (client, message, args, data) => {
        let guild = data.guild
        if (guild.dataValues.Add) return message.channel.send(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot ! `)

        if (args[0] == 'banque') {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.reply(":warning: Utilisateur Invalide")
            let amount = args[2]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)


            addCoins(member.user.id, message.guild.id, amount, "bank")

            message.channel.send(`:bank: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} coins\` en banque`)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: ${message.author.username} vous a ajouté \`\`${amount} coins\`\` en banque`)
            wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} d'ajouter \`\`${amount} coins\`\` à ${member.user.username}`, "Add Banque")
        }
        else if (args[0] == 'army') {
            let team = await userTeam(false, message.guild.id, args[1])
            if (!team) return message.channel.send(`:x: Team introuvable !`)
            if (!args[2]) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(args[2])) return message.reply(":x: Ceci n'est pas un chiffre valide !")
            await team.increment('army', { by: args[2] });
            wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} vient d'ajouter \`\`${args[1]} troupes\`\` à la team ${team.name}`, "Add Team Troupes")
            return message.reply(`📡 \`${args[2]} troupes\` ont bien été ajouté à la team **${team.name}** !`)

        } else if (args[0] == 'rep') {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.reply(":warning: Utilisateur Invalide")
            let amount = args[2]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)


            addCoins(member.user.id, message.guild.id, amount, "rep")

            message.channel.send(`:small_red_triangle: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} rep\``)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: ${message.author.username} vous a ajouté \`\`${amount} rep\`\``)
            wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} vient d'ajouter \`\`${amount} rep\`\` à ${member.user.username}`, "Add Réputation")

        } else {
            if (args[0] === "team") {
                let team = await userTeam(false, message.guild.id, args[2])
                if (!team) return message.channel.send(`:x: Team introuvable !`)

                if (args[1] === "rep") {

                    let amount = args[3]
                    if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
                    if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                    await team.increment('rep', { by: amount });

                    message.channel.send(`:small_red_triangle: Vous venez de d'ajouter a la team **${team.name}** un montant de \`${amount} rep\``)
                    return wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} vient d'ajouter \`\`${amount} rep\`\` à la team ${team.name}`, "Add Team  Réputation")
                } else {
                    let amount = args[3]
                    if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
                    if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                    await team.increment('coins', { by: amount });

                    message.channel.send(`:coin: Vous venez de d'ajouter a la team **${team.name}** un montant de \`${amount} coins\``)
                    return wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} vient d'ajouter \`\`${amount} coins\`\` à la team ${team.name}`, "Add Team Coins")
                }
            }

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member)
                return message.reply(":warning: Utilisateur Invalide")

            let amount = args[1]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

            addCoins(member.user.id, message.guild.id, amount, "coins")

            message.channel.send(`:coin: Vous venez de d'ajouter à ${member.user.username} un montant de \`${amount} coins\``)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: ${message.author.username} vous a ajouté \`\`${amount} coins\`\``)
            wlog(message.author, "#7CF50B", message.guild, `:warning: ${message.author.username} vient d'ajouter \`\`${amount} coins\`\` à ${member.user.username}`, "Add")

        }
    }
}


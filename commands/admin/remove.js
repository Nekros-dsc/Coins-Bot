var items = require("../../shop.json");
const { wlog, verifnum } = require("../../base/functions");
const removeCoins = require("../../base/functions/removeCoins");
const userTeam = require("../../base/functions/teams/userTeam");
const getUser = require("../../base/functions/getUser");

module.exports = {
    name: "remove",
    description: "Retire des biens à un joueur",
    whitelist: true,
    run: async (client, message, args, data) => {
        if (data.guild.dataValues.Remove) return message.channel.send(`Ces commandes ont été désactivé sur le serveur par le propriétaire du bot ! `)
        if (args[0]) args[0] = args[0].toLowerCase()
        const batiments = Object.keys(items.bat);
        if (args[0] == 'banque') {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.reply(":warning: Utilisateur Invalide")
            let amount = args[2]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
            if (isNaN(amount) || amount < 1) return message.channel.send(`:x: Ceci n'est pas un chiffre valide 2!`)
            removeCoins(member.user.id, message.guild.id, amount, "bank")
            message.reply(`:bank: Vous venez de retirer à ${member.user.username} un montant de \`${amount} coins\` en banque`)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: ${message.author.tag} vous a retiré \`\`${amount} coins\`\` en banque`)
            wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} de retirer \`\`${amount} coins\`\` à ${member.user.tag}`, "Remove Banque")
        } else if (args[0] == 'army') {
            let team = await userTeam(false, message.guild.id, args[1])
            if (!team) return message.channel.send(`:x: Team introuvable !`)
            if (!args[2]) return message.channel.send(`:x: Merci de préciser un montant à ajouter`)
            if (!verifnum(args[2])) return message.reply(":x: Ceci n'est pas un chiffre valide !")
            await team.decrement('army', { by: args[2] });
            wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} vient de retirer \`\`${args[1]} troupes\`\` à la team ${team.name}`, "Remove Team Troupes")
            return message.reply(`📡 \`${args[2]} troupes\` ont bien été retiré à la team **${team.name}** !`)
        } else if (args[0] == 'rep') {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!member) return message.reply(":warning: Utilisateur Invalide")
            let amount = args[1]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
            if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)
            removeCoins(member.user.id, message.guild.id, amount, "rep")
            message.channel.send(`:small_red_triangle: Vous venez de retirer à ${member.user.username} un montant de \`${amount} rep\``)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :small_red_triangle_down: ${message.author.tag} vous a retiré \`\`${amount} rep\`\``)
            wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} de retirer \`\`${amount} rep\`\` à ${member.user.tag}`, "Remove Réputation")

        } else if (batiments.includes(args[1])) {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member) return message.reply(":warning: Utilisateur Invalide")
            let memberDB = await getUser(member.id, message.guild.id)
            let bats = memberDB.Batiments || {}
            if (!bats[args[1]]) return message.reply(`:x: ${member.user.username} n'a pas de \`${args[1]}\` !`);

            delete bats[args[1]]
            await memberDB.update({ Batiments: bats }, { where: { primary: memberDB.primary }});

            message.reply(`:coin: Vous venez de retirer à ${member.user.username} son **${args[1]}**`);


        } else {

            if (args[0] === "team") {
                let team = await userTeam(false, message.guild.id, args[2])
                if (!team) return message.channel.send(`:x: Team introuvable !`)
                if (args[1].toLowerCase() == "team") {
                    let amount = args[3]
                    if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
                    if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                    await team.decrement('rep', { by: amount });

                    message.channel.send(`:small_red_triangle: Vous venez de retirer a la team **${team.name}** un montant de \`${amount} rep\``)
                    return wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} vient de retirer \`\`${amount} rep\`\` à la team ${team.name}`, "Remove Team  Réputation")

                } else {
                    let amount = args[3]
                    if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
                    if (!verifnum(amount)) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)

                    await team.decrement('coins', { by: amount });

                    message.channel.send(`:coin: Vous venez de retirer a la team ${team.name} un montant de \`${amount} coins\``)
                    return wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} de retirer \`\`${amount} coins\`\` à la team ${team.name}`, "Remove Team Coins")
                }
            }
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member)
                return message.reply(":warning: Utilisateur Invalide")

            let amount = args[1]
            if (!amount) return message.channel.send(`:x: Merci de préciser un montant à retirer`)
            if (isNaN(amount) || amount < 1) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)


            removeCoins(member.user.id, message.guild.id, amount, "coins")

            message.reply(`:coin: Vous venez de retirer à ${member.user.username} un montant de \`${amount} coins\``)
            //db.push(`${message.guild.id}_${member.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: ${message.author.tag} vous a retiré \`\`${amount} coins\`\``)
            wlog(message.author, "#F5600B", message.guild, `:warning: ${message.author.tag} vient de retirer \`\`${amount} coins\`\` à ${member.user.tag}`, "Remove")
        }
    }
}
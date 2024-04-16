const { verifnum } = require("../../base/functions");
const userTeam = require("../../base/functions/teams/userTeam");
module.exports = {
    name: "tarmysend",
    description: "Permets d'envoyer des troupes à une autre team",
    usage: "tarmysend <teamid> <troupes>",
    aliases: ['tas'],

    run: async (client, message, args, data) => {
        let authorteam = await userTeam(message.member.id, message.guild.id)
        if (!authorteam.rep || parseInt(authorteam.rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)

        if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            targetteam = await userTeam(member.id, message.guild.id)
        } else targetteam = await userTeam(false, message.guild.id, args[0])
        if (!targetteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
        if (rslow.allattacks[message.guild.id, "-", authorteam.teamid]) return message.reply(`:x: Vous êtes en guerre, veuillez attendre la fin de celle-ci pour envoyer des troupes`)

            if (authorteam.teamid == targetteam.teamid) return message.channel.send(`:x: Vous ne pouvez pas vous envoyer des renforts !`)
            if (!args[1] || !verifnum(args[1])) return message.reply(":x: Vous devez préciser le nombre de soldats que vous envoyez !")

            if (!authorteam.army || parseInt(authorteam.army) <= 0) return message.reply(":x: Vous n'avez pas d'armée !\nVeuillez faire la commande \`tarmy\` pour initialiser votre armée !")
            if (parseInt(authorteam.army)< args[1]) return message.reply(":x: Vous n'avez pas autant de troupes !")
            authorteam.decrement('army', { by: args[1] });
            targetteam.increment('army', { by: args[1] });
            return message.reply(`📡 \`${args[1]} troupes\` ont bien été envoyé à la team **${name}** !`)

    }
}

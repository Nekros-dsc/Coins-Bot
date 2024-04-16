const { wlog } = require("../../base/functions");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
    name: "rep",
    description: "Vote pour un joueur",
    usage: "rep <@member/teamname>",
    aliases: ['reputation', 'vote', 'trep'],

    run: async (client, message, args, data) => {
        let timeout = 10800000
        if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "rep", timeout, true))) return

        if (!args[0]) return message.reply({ content: ":x: `ERROR:` Veuillez mentionner un membre ou préciser l'ID d'une team !", allowedMentions: { repliedUser: false } })

        if (message.mentions.members.first()) {
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!member || member.user.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            let memberDB = await getUser(member.id, message.guild.id)
            if (member.user.id === message.author.id) return message.channel.send(":x: Vous ne pouvez pas voter pour vous-même !")
            memberDB.increment('Rep', { by: 1 });
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "rep", timeout, false))) return
            message.reply({ content: `:small_red_triangle: ${member} vient de gagner \`1 réputation\``, allowedMentions: { repliedUser: false } })
            //db.push(`${message.guild.id}_${member.user.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :small_red_triangle: \`${message.author.tag}\` a voté pour vous, vous gagnez \`1 réputation\``)
            wlog(message.author, "ORANGE", message.guild, `${message.author.tag} vient de voter pour ${member.user.tag}`, "Reputation")
        } else {

            let team = await userTeam(false, message.guild.id, args[0])
            if (!team) return message.channel.send(`:x: Cette team n'existe pas !`)
            team.increment('rep', { by: 1 });
            if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "rep", timeout, false))) return
            message.reply({ content: `:small_red_triangle: La team \`${team.name}\` vient de gagner \`1 réputation\``, allowedMentions: { repliedUser: false } })
            wlog(message.author, "ORANGE", message.guild, `${message.author.tag} vient de voter pour la team ${team.name}`, "Team Reputation")
        }


    }
}




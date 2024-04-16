const Discord = require('discord.js');
const { Teams } = require('../../base/Database/Models/Teams');

module.exports = {

    name: "ttop",
    description: "Affiche le top des teams",
    aliases: ['top-team', 't-top', 'team-top'],

    run: async (client, message, args, data) => {

        message.reply({ content: `Mise à jour du classement en cours....`, allowedMentions: { repliedUser: false } }).then(async medit => {

            let money = await Teams.findAll({
                where: {
                    GuildId: message.guild.id
                }
            });
            money = money.sort((a, b) => b.coins - a.coins)
            let finalLb = "";
            let m = 10
            if (money.length < 10) m = money.length
            let k = 0
            for (var user of money) {
                if (!user) { money.length = money.length + 1; continue; }
                if (user) {
                    if (parseInt(user.coins) === 0) break;
                    k++
                    finalLb += `${`${k}`.replace("1", "🥇").replace("2", "🥈").replace("3", "🥉")} ) **${user.name}** (id: ${user.teamid}) \n┖ \`${user.coins} coins\`\n`;
                    if (k >= m) break;
                }
            }
            let result =  finalLb || "Aucune team dans le classement !"
            /*let finallb = teams.map((value, index) => `${`${(index + 1)}`.replace("1", "🥇").replace("2", "🥈").replace("3", "🥉")} ) **${value.name}** (id: ${value.teamid}) \n┖ \`${value.coins} coins\``).join("\n")
            if (finallb.length < 1) finallb = "Aucune team dans le classement !"*/
            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Leaderboard des team sur ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setDescription(`${result}`)
                .setColor(data.color)
            return medit.edit({ content: `** **`, embeds: [embed] })

        })

    }
}
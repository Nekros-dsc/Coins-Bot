const Discord = require('discord.js');

exports.help = {
  name: 'ttop',
  aliases: ['top-team' , 't-top' , 'team-top'],
  description: 'Affiche le top des teams',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    message.reply({ content: `Mise à jour du classement en cours....`, allowedMentions: { repliedUser: false } }).then(async medit => {

        let money = bot.db.prepare('SELECT * FROM team').all()
        money = money.sort((a, b) => JSON.parse(b.coins).coins - JSON.parse(a.coins).coins)
        let finalLb = "";
        let m = 10
        if (money.length < 10) m = money.length
        let k = 0
        for (var user of money) {
            if (!user) { money.length = money.length + 1; continue; }
            if (user) {
                if (parseInt(user.coins) === 0) break;
                k++
                finalLb += `${`${k}`.replace("1", "🥇").replace("2", "🥈").replace("3", "🥉")} ) **${user.name}** (id: ${user.id}) \n┖ \`${JSON.parse(user.coins).coins} coins\`\n`;
                if (k >= m) break;
            }
        }
        let result =  finalLb || "Aucune team dans le classement !"
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Leaderboard des team sur ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`${result}`)
            .setColor(data.color)
        return medit.edit({ content: `** **`, embeds: [embed] })

    })
}   
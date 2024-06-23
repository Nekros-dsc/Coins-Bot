const Discord = require('discord.js');

exports.help = {
  name: 'owner',
  aliases: ['owner-add'],
  description: 'Ajoute un membre aux owner',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration'
}
exports.run = async (bot, message, args, config, data) => {
    if(!config.buyers.includes(message.author.id)) return message.channel.send('Vous devez être propriétaire pour utiliser cette commande !')
        const actualowners = JSON.parse(data.owners)
        if(args[0] ) args[0] = args[0].toLowerCase()
            if (args[0] === "clear") {
                bot.db.prepare(`UPDATE guild SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify([]), id: message.guild.id});
              return message.reply(`:recycle: Les owner ont bien été clear !`)
      
            } else if (!args[0]) {
              let difarr = actualowners;
      
              let finallb = ""
              let allmemberlen = ""
              if (difarr.length == 0) { finallb = "Aucun owner" } else {
                allmemberlen = difarr.length
                let people = 0;
                let peopleToShow = 31;
      
                let mes = [];
      
                for (let i = 0; i < allmemberlen; i++) {
                  if (difarr === null) continue;
                  let g = bot.users.cache.get(difarr[i])
      
                  if (!g) {
                    g = `<@${difarr[i]}> (id: ${difarr[i]})`
                  } else {
                    g = `<@${difarr[i]}>`
                  }
                  mes.push({
                    name: g
                  });
                }
      
                const realArr = []
                for (let k = 0; k < mes.length; k++) {
                  people++
                  if (people >= peopleToShow) continue;
                  realArr.push(`${k + 1}) ${mes[k].name}`);
                }
                finallb = realArr.join("\n")
                let p = 1000 - mes.length;
                if (p < 0) {
                  p = p * (-1);
                }
              }
              let owner = new Discord.EmbedBuilder()
                .setTitle(`Owner list`)
                .setDescription(finallb)
                .setColor(data.color)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
      
              return message.reply({ embeds: [owner], allowedMentions: { repliedUser: false } })
      
            } else {
              let m = message.mentions.members.first() || message.guild.members.cache.get(args[0])
              if (!m || m.bot) return message.reply({ content: "\`❌\` `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      
              if (actualowners.includes(m.id)) return message.reply(`\`❌\` ${m.user.username} est déjà owner !`)
      
                actualowners.push(m.id)
                bot.db.prepare(`UPDATE guild SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify(actualowners), id: message.guild.id});
                return message.reply(`\`✅\` ${m.user.username} est maintenant owner du bot !`)
      
            }

}
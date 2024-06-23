const Discord = require('discord.js');

exports.help = {
  name: 'unowner',
  aliases: [],
  description: 'Retire un owner',
  use: 'unowner <@user/id>',
  category: 'Administration'
}
exports.run = async (bot, message, args, config, data) => {
    let actualowners = JSON.parse(data.owners)
    var founder = config.buyers
    if (founder.includes(message.author.id)) {
        let id
        if (message.mentions.users.first()) {
            let m = message.mentions.users.first()
            if (!m || m.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
            id = m.id
        } else {
            if (isNaN(args[0])) return message.channel.send(`:x: Aucun membre trouvé !`)
            id = args[0]
        }
        let mm = bot.users.cache.get(id)
        if (!mm) mm = `<@${id}>`
        if (!actualowners.includes(id)) return message.channel.send(`\`❌\` \`${`${mm}`.replaceAll("`", "")}\` n'est pas dans la liste des owners !`)
        actualowners = actualowners.filter(u => u !== id)
        bot.db.prepare(`UPDATE guild SET owners = @coins WHERE id = @id`).run({ coins: JSON.stringify(actualowners), id: message.guild.id});
        return message.channel.send(`\`✅\` ${mm} n'est plus owner du bot !`)

    }
}
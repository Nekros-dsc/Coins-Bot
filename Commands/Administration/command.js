const Discord = require('discord.js');

exports.help = {
  name: 'command',
  aliases: [],
  description: 'Autorise/Bloque les commandes dans certains salons',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    let ActualPlayChannels = JSON.parse(data.blockedCommand)
    if (args[0]) args[0] = args[0].toLowerCase()
    if (args[0] == 'block' || args[0] == 'deny') {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
      if (!channel) return message.channel.send(`:x: Salon incorrect`)
      if (ActualPlayChannels.includes(channel.id)) return message.reply(":eyes: Les commandes sont déjà interdites dans ce salon")
      ActualPlayChannels.push(channel.id)
      bot.db.prepare(`UPDATE guild SET blockedCommand = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualPlayChannels), id: message.guild.id});
      message.channel.send(`\`✅\` Les commandes dans le salon ${channel} ont été désactivé !`)
    } else if (args[0] == 'allow') {
      var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
      if (!channel) return message.channel.send(`:x: Salon incorrect`)
      if (!ActualPlayChannels.includes(channel.id)) return message.reply(":eyes: Les commandes ne sont pas interdites dans ce salon")
      ActualPlayChannels = ActualPlayChannels.filter(c => c !== channel.id)
      bot.db.prepare(`UPDATE guild SET blockedCommand = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualPlayChannels), id: message.guild.id});
      message.channel.send(`\`✅\` Les commandes dans le salon ${channel} sont réactivées !`)
    } else { message.channel.send(`:question: Bloque ou débloque les commandes dans un salon !\nUsage: \`${data.prefix}command <block/allow> <#channel>\``) }
}
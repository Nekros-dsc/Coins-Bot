
module.exports = {
  name: "command",
  description: "Autorise/Bloque les commandes dans certains salons",
  cooldown: 2,
  whitelist: true,
  run: async (client, message, args, data) => {
    const ActualPlayChannels = data.guild.PlayChannels || {}
    if (args[0]) args[0] = args[0].toLowerCase()
    if (args[0] == 'block' || args[0] == 'deny') {
      var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
      if (!channel) return message.channel.send(`:x: Salon incorrect`)
      if (ActualPlayChannels[channel.id]) return message.reply(":eyes: Les commandes sont déjà interdites dans ce salon")
      ActualPlayChannels[channel.id] = true
      await data.guilds.update({ PlayChannels: ActualPlayChannels }, { where: { guildId: message.guild.id }});
      message.channel.send(`\`✅\` Les commandes dans le salon ${channel} ont été désactivé !`)
    } else if (args[0] == 'allow') {
      var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
      if (!channel) return message.channel.send(`:x: Salon incorrect`)
      if (!ActualPlayChannels[channel.id]) return message.reply(":eyes: Les commandes ne sont pas interdites dans ce salon")
      delete ActualPlayChannels[channel.id]
      await data.guilds.update({ PlayChannels: ActualPlayChannels }, { where: { guildId: message.guild.id }});
      message.channel.send(`\`✅\` Les commandes dans le salon ${channel} sont réactivées !`)
    } else { message.channel.send(`:question: Bloque ou débloque les commandes dans un salon !\nUsage: \`${data.guild.Prefix}command <block/allow> <#channel>\``) }
  }
}
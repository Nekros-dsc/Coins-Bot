const Discord = require('discord.js');

exports.help = {
  name: 'setleaderboard',
  aliases: ['setlb'],
  description: 'Définie le salon du leaderboard interactif',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
    if (!channel || channel.type !== Discord.ChannelType.GuildText) return message.channel.send(`:x: Salon incorrect`)

    message.channel.send(`Vous avez changé le salon du leaderboard interactif à ${channel}`)

    let Embed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setTitle(`Initialisation du leaderboard interactif en cours...`)
      .setDescription(`_Estimation de l'attente: \`30 secondes\`_`);

    const msg = await channel.send({ embeds: [Embed] })
    const json = {
        "channel": channel.id,
        "msgId": msg.id
    }
    bot.db.prepare(`UPDATE guild SET leaderboard = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
}
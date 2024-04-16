const Discord = require('discord.js');
module.exports = {

  name: "setleaderboard",
  description: "Modifie le leaderboard interactif",
  aliases: ['setlb'],
  whitelist: true,
  run: async (client, message, args) => {
    return message.reply(":x: En maintenance")
      let user = message.member

      const color = db.fetch(`${message.guild.id}_embedcolor_${user.id}`)

      var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
      if (!channel || channel.type !== 'GUILD_TEXT') return message.channel.send(`:x: Salon incorrect`)
      db.set(`leaderboard_${message.guild.id}`, channel.id)

      message.channel.send(`Vous avez changé le salon du leaderboard interactif à ${channel}`)

      let Embed = new Discord.EmbedBuilder()
        .setColor(color)
        .setTitle(`Initialisation du leaderboard interactif en cours...`)
        .setDescription(`_Estimation de l'attente: \`30 secondes\`_`);

      channel.send({ embeds: [Embed] }).then(msg => { db.set(`msgleaderboard_${message.guild.id}`, msg.id) })


  }
}
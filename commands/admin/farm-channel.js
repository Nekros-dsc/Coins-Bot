const { EmbedBuilder } = require("discord.js");
const { verifnum } = require("../../base/functions");

module.exports = {

  name: "farm-channel",
  description: "Modifie les salons où les coins sont gagnés",
  aliases: ["fc"],
  usage: "farm-channel <all/add/remove> <#channel> <*multiplicateur*>",
  cooldown: 1,
  whitelist: true,
  run: async (client, message, args, data) => {
    var channel = message.mentions.channels.first() || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.slice(1).join(" ").toLocaleLowerCase()) || message.guild.channels.cache.get(args[1])
    let channels = data.guild.FarmChannels || {}

    if (args[0] == 'add') {
      if (!channel || !['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(channel.type)) return message.channel.send(`:x: Salon incorrect`)

      if (args[2] && (!verifnum(args[2]) || args[2] > 10 || args[2] < 1)) return message.reply(":x: Le multiplicateur du salon doit être un entier comprix entre 1 et 10 !")

      channels[channel.id] = args[2] || 1
      await data.guilds.update({ FarmChannels: channels }, { where: { guildId: message.guild.id }});
      message.reply({ content: `:loud_sound: Le salon <#${channel.id}> a été ajouté comme salon de farm !`, allowedMentions: { repliedUser: false } })

    } else if (args[0] == 'remove') {
      if (!channel || !['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(channel.type)) return message.channel.send(`:x: Salon incorrect`)
      if (!channels[channel.id]) return message.reply(`:x: Ce salon n'est pas défini comme salon de farm !`)

      delete channels[channel.id]
      await data.guilds.update({ FarmChannels: channels }, { where: { guildId: message.guild.id }});
      return message.channel.send(`:loud_sound: Le salon <#${channel.id}> n'est plus considéré comme un salon pour farm !`)

    } else if (args[0] == 'all') {
      await data.guilds.update({ FarmChannels: null }, { where: { guildId: message.guild.id }});
      message.channel.send(`:loud_sound: Les membres peuvent désormais farm leurs coins dans **tous les salons du serveur** !`)

    } else {
      channels = Object.keys(channels).map(key => [key, channels[key]]); 
      let page = Math.round(channels.length / 10 + 1)
      for (let i = 1; i < page + 1; i++) {
        const embeddd = new EmbedBuilder()
          .setDescription(channels.length>0 ? list((i - 1) * 10, i * 10) : "Tous les salons sont définis comme salon de farm")
          .setTitle(`:loud_sound: Configuration des vocaux farm`)
          .setColor(data.color)
          .addField(`Pour modifier le lieu où l'on gagne des coins en vocal faites :`, `\`${data.guild.Prefix}farm-channel <all/add/remove> <#channel>\``)
          .setFooter({ text: `Page ${i} / ${page}` })
        message.channel.send({ embeds: [embeddd], allowedMentions: { repliedUser: false } });
      }

      function list(min, max) {
        return channels.map(r => r)
          .map((m, i) => `<#${m[0]}> (multiplicateur: ${m[1]})`)
          .slice(min, max)
          .join('\n');
      }
    }
  }
}

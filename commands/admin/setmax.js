const Discord = require('discord.js')
const { verifnum } = require("../../base/functions");
module.exports = {
  name: "setmax",
  description: "Modifie le stockage",
  whitelist: true,
  run: async (client, message, args, data) => {
    let ActualMax = data.guild.Max || {}
    let key = args[0].toLowerCase()
    if (key === 'entrepot') {
      if (!verifnum(args[1])) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:file_cabinet: Le stockage maximum de l'**entrepot** a été modifié en ` + args[1]);
      ActualMax["entrepot"] = Number(args[1]);
      await data.guilds.update({ Max: ActualMax }, { where: { guildId: message.guild.id }});
      message.reply({ embeds: [Embed] })

    } else {
      let Embed = new Discord.EmbedBuilder()
        .setTitle(`:coin: Configuration du stockage`)
        .setColor(data.color)
        .setDescription(`Pour changer le maximum de stockage de l'entrepot :\n\`${data.guild.Prefix}setmax <entrepot> <gain>\``);
      message.reply({ embeds: [Embed] })
    }

  }
}
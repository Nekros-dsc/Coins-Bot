const Discord = require('discord.js');

exports.help = {
  name: 'setmax',
  aliases: ['set-max'],
  description: 'Modifie le stockage',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "WHITELIST"
}
exports.run = async (bot, message, args, config, data) => {
    let ActualMax = JSON.parse(data.gain)
    let key = args[0].toLowerCase()
    if (key === 'entrepot') {
      if (!verifnum(args[1])) return message.channel.send(`:x: Ceci n'est pas un chiffre valide !`)
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:file_cabinet: Le stockage maximum de l'**entrepot** a été modifié en ` + args[1]);
      ActualMax["entrepotMax"] = Number(args[1]);
      bot.db.prepare(`UPDATE guild SET gain = @coins WHERE id = @id`).run({ coins: JSON.stringify(ActualMax), id: message.guild.id});
      message.reply({ embeds: [Embed] })

    } else {
      let Embed = new Discord.EmbedBuilder()
        .setTitle(`:coin: Configuration du stockage`)
        .setColor(data.color)
        .setDescription(`Pour changer le maximum de stockage de l'entrepot :\n\`${data.prefix}setmax <entrepot> <gain>\``);
      message.reply({ embeds: [Embed] })
    }
}

function verifnum(money) {
    return /^[1-9]\d*$/.test(money);
}
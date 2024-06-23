const Discord = require('discord.js');

exports.help = {
  name: 'block',
  aliases: [],
  description: 'Permets de bloquer les commandes add, remove et reset',
  use: 'block <add/remove/reset>',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    let json = JSON.parse(data.blockedCommandAdmin)
    if (args[0] == 'add') {
        json['add'] = 'on'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour ajouter de l'argent ont été retiré`)
      } else if (args[0] == 'reset') {
        json['reset'] = 'on'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour reset ont été retiré !`)
      } else if (args[0] == 'remove') {
        json['remove'] = 'on'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour retirer de l'argent ont été retiré`)
      } else {
        message.channel.send("Veuillez précisez si vous souhaitez bloquer les ajouts d'argent `add` ou les `remove` d'argent ou les `reset`!")
      }
}
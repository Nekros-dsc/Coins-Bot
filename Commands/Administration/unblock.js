const Discord = require('discord.js');

exports.help = {
  name: 'unblock',
  aliases: [],
  description: 'Re-active l\'ajout de coins',
  use: 'unblock <add/remove/reset>',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    let json = JSON.parse(data.blockedCommandAdmin)
    if (args[0] == 'add') {
        json['add'] = 'off'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour ajouter de l'argent ont été activé`)
      } else if (args[0] == 'reset') {
        json['reset'] = 'off'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour reset ont été activé !`)
      } else if (args[0] == 'remove') {
        json['remove'] = 'off'
        bot.db.prepare(`UPDATE guild SET blockedCommandAdmin = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.guild.id});
        message.channel.send(`:red_circle: Les commandes pour retirer de l'argent ont été activé`)
      } else {
        message.channel.send("Veuillez précisez si vous souhaitez activé les ajouts d'argent `add` ou les `remove` d'argent ou les `reset`!")
      }
}
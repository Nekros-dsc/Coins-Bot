const Discord = require('discord.js');

exports.help = {
  name: 'update',
  aliases: [],
  description: 'Mets à jour le bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    return message.reply(`_Pour mettre votre bot à jour, veuillez vous rendre sur le [support](https://discord.gg/7hDfsSZeCK) du bot et faire \`/update\`_`)
}
const Discord = require('discord.js');

exports.help = {
  name: 'info',
  aliases: ['infos'],
  description: 'Configuration du serveur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    message.reply(`:x: Commande en développement !`)
}
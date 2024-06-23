const Discord = require('discord.js');

exports.help = {
  name: 'set-language',
  aliases: ["language"],
  description: 'Edit bot language',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    return message.reply(`:x: En cours de développement :heart:`)
}   
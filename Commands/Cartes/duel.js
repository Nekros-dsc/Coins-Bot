const Discord = require('discord.js');

exports.help = {
  name: 'carddrop',
  aliases: ['cduel'],
  description: 'Lance un duel de cartes',
  use: 'duel <@user>',
  category: 'Cartes'
}
exports.run = async (bot, message, args, config, data) => {
    return message.reply(`:x: Vous n'avez pas de carte pour lancer un duel !`)
}
const Discord = require('discord.js');

exports.help = {
  name: 'mycard',
  aliases: ['cards' , 'card' , 'mycards'],
  description: 'Affiche les cartes',
  use: 'mycards',
  category: 'Cartes'
}
exports.run = async (bot, message, args, config, data) => {
    return message.reply(`:x: Le système de carte est désactivé, vous ne pouvez plus collecter de cartes.`)
}
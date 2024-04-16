const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message } = require('discord.js');
const color = require('../../base/functions/color');
const addCoins = require('../../base/functions/addCoins');
const { verifnum } = require('../../base/functions');

module.exports = {
  name: "tutoriel",
  description: "Affiche un rapide tutoriel sur le bot",
  cooldown: 2,
  aliases: ['tuto'],

  run: async (client, message, args, data) => {
    return message.reply(":construction_worker: En cours de développement https://discord.gg/uhq")
  }
}
const Discord = require("discord.js");
const { webhook  } = require("../../base/functions");
module.exports = {
    name: "invite",
    description: "Envois les liens relatifs au bot",
    aliases: ['invitation', 'addbot', 'support'],

run: async (client, message, args, data) => {
    
    try {
    let embed = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setDescription(`[\`Support du bot\`](https://discord.gg/uhq)  |  [\`Lien pour ajouter ${client.user.username}\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) | [\`Vote pour ${client.user.username}\`](https://top.gg/bot/874400416731922432/vote)`)
    return message.reply({ embeds: [embed] })
} catch (error) {
    webhook(error, message)
  }
    }
};
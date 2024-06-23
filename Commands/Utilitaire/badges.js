const Discord = require('discord.js');

exports.help = {
  name: 'badges',
  aliases: ['badge' , 'bdg'],
  description: 'Affiche les badges d\'un utilisateur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    const embed = new Discord.EmbedBuilder()
    .setColor(data.color)
    .setTitle(`:mortar_board: Voici vos badges`)
    .setDescription(`Vous n'avez pas de badges !`)
    .setFooter({ text: config.footerText + " | 1/1"})
    .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1250165092931338250/badges.png?ex=6669f279&is=6668a0f9&hm=198b9a5c5b2fb37ef0f5bd7ef1b7e6eef2ce211c68fad0819c4918794c26c912&=&format=webp&quality=lossless&width=404&height=404`)

    message.reply({ embeds: [embed]})
}
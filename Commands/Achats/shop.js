const Discord = require('discord.js');
var items = require("../../Utils/function/shop.json");

exports.help = {
  name: 'shop',
  aliases: ['boutique'],
  description: 'Affiche le shop du bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Achats'
}
exports.run = async (bot, message, args, config, data) => {
    const buildingList = Object.entries(items.bat).map(([key, value]) => {
        const gain = JSON.parse(data.gain)[key].gain;
        const price = JSON.parse(data.gain)[key].price
        return `**${key.charAt(0).toUpperCase() + key.slice(1)}** \n Prix: ${price}, Gain: ${gain} coins`;
      }).join('\n')
      let rprice = JSON.parse(data.gain).antirob.price
      //METIER
      const jobList = Object.entries(items.job).map(([name, job]) => {
        const price = JSON.parse(data.gain)[name]
        return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
      }).join('\n\n')
      const capaList = Object.entries(items.capacite).map(([name, job]) => {
        const price = JSON.parse(data.gain)[name]
        return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
      }).join('\n\n')
      //EMBED
      const colors = config.color;
      let ListColor = "Aucune couleur"
      if (colors && colors.length) {
  
  
        const colorDictionary = {};
        const priceDictionary = {};
        colors.forEach(color => {
          const colorName = color.name.toLowerCase();
          colorDictionary[colorName] = color;
          priceDictionary[colorName] = color.price;
        });
        ListColor = colors.map(color => {
          return `\`${color.name.charAt(0).toUpperCase() + color.name.slice(1)}\` \n Prix : ${color.price} rep :small_red_triangle:`;
        }).join("\n")
      }
      let Embed2 = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Voici le shop du serveur ` + message.guild.name)
        .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1249779379303743570/shop.png?ex=666d287f&is=666bd6ff&hm=4162db0234e2777c594349ff9f06142b9408ac6df00034ef29c0f66e647292df&=&format=webp&quality=lossless&width=450&height=450`)
        .setDescription(`\`\`\` BATIMENTS \`\`\`
  _Commande: \`buy\`_
  ${buildingList}
  **Anti-rob**\nPrix: ${rprice} coins
  
  \`\`\` METIERS \`\`\`
  _Commande: \`job\`_
  ${jobList}
  
  \`\`\` CAPACITÉS \`\`\`
  _Commande: \`mobil\`_
  ${capaList}
  
  \`\`\` EMBED \`\`\`
  _Commande: \`embed\`_
  ${ListColor}
  
  _Vous ne pouvez avoir qu'un seul métier ainsi qu'une seule capacité_
  `)
        .setFooter({ text: `${message.member.user.username}`, iconURL: `${message.member.user.displayAvatarURL({ dynamic: true })}` });
      message.channel.send({ embeds: [Embed2] })
}
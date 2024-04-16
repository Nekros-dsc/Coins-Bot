const Discord = require('discord.js');
var items = require("../../shop.json");
const { Color } = require('../../base/Database/Models/Colors');
module.exports = {
  name: "shop",
  description: "Affiche le shop du bot",
  aliases: ['boutique'],

  run: async (client, message, args, data) => {
    //BAT

    const buildingList = Object.entries(items.bat).map(([key, value]) => {
      const gain = (data.guild.Gains||{})[`${key}gain`] || value.gain
      const price = (data.guild.Prices||{})[`${key}price`] || value.price
      return `**${key.charAt(0).toUpperCase() + key.slice(1)}** \n Prix: ${price}, Gain: ${gain} coins`;
    }).join('\n')
    let rprice = data.guild.Prices["antirobprice"] || items.other.antirob.price
    //METIER
    const jobList = Object.entries(items.job).map(([name, job]) => {
      const price = data.guild.Prices[`${name}price`] || job.price
      return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
    }).join('\n\n')
    const capaList = Object.entries(items.capacite).map(([name, job]) => {
      const price = data.guild.Prices[`${name}price`] || job.price
      return `**${name.charAt(0).toUpperCase() + name.slice(1)}** \n Prix : ${price} rep :small_red_triangle:\n ┖ ${job.description}`;
    }).join('\n\n')
    //EMBED
    const colors = await Color.findAll();
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
}
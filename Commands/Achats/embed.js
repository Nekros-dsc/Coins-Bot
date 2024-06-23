const Discord = require('discord.js');

exports.help = {
  name: 'embed',
  aliases: ['color'],
  description: 'Change la couleur de vos embed',
  use: 'embed <info/bleu/rouge/jaune/vert/invisible>',
  category: 'Achats'
}
exports.run = async (bot, message, args, config, data) => {
    let user = bot.functions.checkUser(bot, message, args, message.author.id)

    const colors = config.color;
    if (!colors || colors.length === 0) {
        return message.channel.send("Aucune couleur trouvée dans la base de données.");
    }

    const colorDictionary = {};
    const priceDictionary = {}; 
    colors.forEach(color => {
        const colorName = color.name.toLowerCase();
        colorDictionary[colorName] = color;
        priceDictionary[colorName] = color.price;
    });

    const colorName = args[0]?.toLowerCase(); 

    if (colorName === 'info') {
        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Voici la boutique du serveur ${message.guild.name}`)
            .setDescription(`${colors.map(color => {
                return `\`${color.name}\`\nPrix: ${color.price} rep :small_red_triangle:`;
            }).join("\n")}`)
            .setFooter({ text: `Les récompenses sont attribuées toutes les 4 heures` });

        message.channel.send({ embeds: [embed] });
    } else if (colorName && colorDictionary.hasOwnProperty(colorName)) {
        const selectedColor = colorDictionary[colorName];
        const colorPrice = priceDictionary[colorName];

        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(`:x: Vous avez besoin de ${colorPrice} rep pour acheter la couleur **${selectedColor.name}**`);

        if (JSON.parse(user.coins).rep < colorPrice) {
            return message.channel.send({ embeds: [embed] });
        }

        if (user.color === selectedColor.hexCode) {
            return message.channel.send(`:x: Vous avez déjà la couleur **${selectedColor.name}**`);
        }
        const json = {
            'coins': parseInt(JSON.parse(user.coins).coins),
            'bank': JSON.parse(user.coins).bank,
            'rep': JSON.parse(user.coins).rep - parseInt(colorPrice)
        }
        bot.db.prepare(`UPDATE user SET coins = @coins, color = @color WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id, color: selectedColor.hexCode });

        const successEmbed = new Discord.EmbedBuilder()
            .setColor(selectedColor.hexCode)
            .setDescription(`:white_check_mark: La couleur de vos embed sera désormais **${selectedColor.name}**\n${colorPrice} rep vous ont été prélevés !`);

        message.channel.send({ embeds: [successEmbed] });
    } else {
        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setDescription(":x: Couleur invalide. Utilisez `embed info` pour voir les couleurs disponibles.");

        message.channel.send({ embeds: [embed] });
    }
}
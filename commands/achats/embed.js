const Discord = require('discord.js');
const { Color } = require('../../base/Database/Models/Colors');
const getUser = require('../../base/functions/getUser');

module.exports = {
    name: "embed",
    description: "Change la couleur de vos embed",
    usage: "embed <info/bleu/rouge/jaune/vert/invisible>",
    aliases: ["color"],

    run: async (client, message, args, data) => {
        const User = data.users;
        let user = await User.findOne({ where: { userId: message.author.id, guildId: message.guild.id } });
        if (!user) user = await getUser(message.author.id, message.guild.id);

        const colors = await Color.findAll();
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

            if (user.Rep < colorPrice) {
                return message.channel.send({ embeds: [embed] });
            }

            if (user.Color === selectedColor.hexCode) {
                return message.channel.send(`:x: Vous avez déjà la couleur **${selectedColor.name}**`);
            }

            await data.users.update({ Color: selectedColor.hexCode, Rep: user.Rep - colorPrice }, { where: { userId: message.author.id, guildId: message.guild.id } });

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
};

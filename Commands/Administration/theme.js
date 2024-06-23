const Discord = require('discord.js');

exports.help = {
  name: 'theme',
  aliases: ['themes'],
  description: 'Modifie la couleur par défaut du bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    if (args.length) {
        let str_content = args.join(" ")
        try {
            const embedTest = new Discord.EmbedBuilder().setColor(str_content.charAt(0).toUpperCase() + str_content.slice(1))
            bot.db.prepare(`UPDATE guild SET color = @coins WHERE id = @id`).run({ coins: (str_content.charAt(0).toUpperCase() + str_content.slice(1)), id: message.guild.id});
          const embed = new Discord.EmbedBuilder()
          .setColor(str_content.charAt(0).toUpperCase() + str_content.slice(1))
          .setDescription(`:white_check_mark: Vous avez défini la couleur de ce serveur en \`${str_content}\` `);
  
        message.reply({ embeds: [embed] });
        } catch(r) {
            message.reply(":x: La couleur est invalide, vous pouvez en trouver sur ce site: https://htmlcolorcodes.com/fr/")
        }
    } else {
        message.channel.send(`:x: Vous n'avez fournie aucune valeur, veuillez refaire la commande en incluant une couleur.`);
    }
}


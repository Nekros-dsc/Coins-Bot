const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "theme",
    description: "Modifie la couleur par défaut du bot",
    aliases: ['themes'],
    owner: true,

    run: async (client, message, args, data) => {

            if (args.length) {
                let str_content = args.join(" ")
                if(!str_content.startsWith("x")) str_content = `#${str_content}`
                if(isValidHexColor(str_content)){
                data.guilds.update(
                    { Color: str_content.replaceAll("#", "") }, 
                    { where: { guildId: message.guild.id } }
                  ); 
                  const embed = new EmbedBuilder()
                  .setColor(str_content)
                  .setDescription(`:white_check_mark: Vous avez défini la couleur de ce serveur en \`${str_content}\` `);
          
                message.reply({ embeds: [embed] });
                } else {
                    message.reply(":x: La couleur est invalide, vous pouvez en trouver sur ce site: https://htmlcolorcodes.com/fr/")
                }
            } else {
                message.channel.send(`:x: Vous n'avez fournie aucune valeur, veuillez refaire la commande en incluant une couleur.`);
            }


    }
}
function isValidHexColor(color) {
    // Expression régulière pour vérifier si le string est un code hexadécimal valide
    const hexColorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
  
    return hexColorRegex.test(color);
  }
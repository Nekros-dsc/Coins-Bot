const Discord = require('discord.js');

exports.help = {
  name: 'setprefix',
  aliases: ['prefix', 'set-prefix'],
  description: 'Modifie le préfix du bot',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration'
}
exports.run = async (bot, message, args, config, data) => {
    if (!message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return message.channel.send(`\`❌\` Vous devez être administrateur pour utiliser cette commande !`)
        if (args.length) {
            let str_content = args.join(" ")
            if(str_content.length > 4) return message.reply(":x: Le prefix ne peut pas être aussi long !")
                bot.db.prepare(`UPDATE guild SET prefix = @coins WHERE id = @id`).run({ coins: str_content, id: message.guild.id});
            message.reply({ content: `:white_check_mark: Vous avez défini le préfix de ce serveur en \`${str_content}\` ` });
        } else {
            message.channel.send(`:x: Vous n'avez fournie aucune valeur, veuillez refaire la commande en incluant un prefix.`);
        }
}
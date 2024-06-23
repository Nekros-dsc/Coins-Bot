const Discord = require('discord.js');

exports.help = {
  name: 'vocal',
  aliases: [],
  description: 'Vous empêches de recevoir des coins en vocal (pour éviter le ping des rob ;) )',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    let member = bot.functions.checkUser(bot, message, args, message.author.id)
    if (member.enableVocal == "off") {
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:no_entry: Vous ne recevrez plus de coins lorsque vous êtes en vocal, refaite la commande \`vocal\` pour réactiver le gain !`);
        bot.db.prepare(`UPDATE user SET enableVocal = @coins WHERE id = @id`).run({ coins: "on", id: message.author.id});
      message.reply({ embeds: [Embed] })
    } else {
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:ballot_box_with_check: Vous recevrez désormais les coins en vocal !`);
      bot.db.prepare(`UPDATE user SET enableVocal = @coins WHERE id = @id`).run({ coins: "off", id: message.author.id});
      message.reply({ embeds: [Embed] })
    }
}
const { EmbedBuilder } = require("discord.js");
const getUser = require("../../base/functions/getUser");

module.exports = {
  name: "bal",
  description: "Affiche les coins du membre mentionné ou de l'auteur du message",
  usage: "coins [@user]",
  cooldown: 2,
  aliases: ['coins', 'balance', 'money', 'bank', "coin"],

  run: async (client, message, args, data) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!member || member.user.bot) {
      return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } });
    }

    const user = await getUser(member.user.id, message.guild.id);
    const totalrep = user.Rep || 0;

    const embed = new EmbedBuilder()
      .setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true })})
      .setDescription(`**${member.user.username}** a
:coin: **${user.Coins}** coins en poche
:bank: **${user.Bank}** coins en banque
:small_red_triangle: **${totalrep}** point${totalrep > 1 ? "s" : ""} de réputation\n`)
      .setColor(data.color)
      .setFooter({text: "♥ CoinsBot by ⲈpicBots"});

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
};

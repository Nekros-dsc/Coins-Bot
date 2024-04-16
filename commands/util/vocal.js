const Discord = require('discord.js')
const getUser = require('../../base/functions/getUser')
module.exports = {

  name: "vocal",
  description: "Vous empêches de recevoir des coins en vocal (pour éviter le ping des rob ;) )",
  cooldown: 2,

  run: async (client, message, args, data) => {
    let member = await getUser(message.member.id, message.guild.id);
    if (member.Vocal) {
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:no_entry: Vous ne recevrez plus de coins lorsque vous êtes en vocal, refaite la commande \`vocal\` pour réactiver le gain !`);
      member.update({ Vocal: false }, { where: { primary: member.primary }});
      message.reply({ embeds: [Embed] })
    } else {
      let Embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setDescription(`:ballot_box_with_check: Vous recevrez désormais les coins en vocal !`);
      member.update({ Vocal: true }, { where: { primary: member.primary }});
      message.reply({ embeds: [Embed] })
    }

  }
}
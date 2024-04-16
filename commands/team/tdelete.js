const Discord = require("discord.js");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
  name: "tdelete",
  description: "Supprime une team",
  owner: true,

  run: async (client, message, args) => {

    if (!isNaN(args[0]) || message.mentions.members.first() || !args[0]) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      if (!member) return message.reply({ content: ":x: `ERROR:`: Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
      authorteam = await userTeam(member.id, message.guild.id)
    } else authorteam = await userTeam(false, message.guild.id, args[0])
    if (!authorteam) return message.channel.send(`:x: Team introuvable !`)
    let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('yes').setEmoji("✅").setLabel(`Oui je veux supprimer la team`)
    let button_no = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('no').setEmoji("❌").setLabel(`Non je ne veux pas supprimer la team`)

    let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_no])
    let finallb = Object.entries(JSON.parse(authorteam.members))
    return message.channel.send({
      content: `:question: Êtes-vous sûr de vouloir supprimer la team ${authorteam.name} (${authorteam.teamid}) ?\n${finallb.length > 1 ? "👥" : "👤"} Elle contient ${finallb.length} membres `,
      components: [button_row],
      allowedMentions: { repliedUser: false }
    }).then(m => {

      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: 30000
      })
      collector.on("collect", async (i) => {
        if (i) {
          if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces bouttons !", ephemeral: true }).catch(() => { })
          collector.stop()
          await i.deferUpdate().catch(() => { })

          if (i.customId === 'yes') {
            authorteam.destroy();
            button_row.components[0].setDisabled(true);
            button_row.components[1].setDisabled(true);
            m.edit({ components: [button_row] }).catch(() => { })
            return message.channel.send(`:white_check_mark: La team ${authorteam.name} a bien été supprimée et ses membres retirés !`)
          } else {
            button_row.components[0].setDisabled(true);
            button_row.components[1].setDisabled(true);
            m.edit({ components: [button_row] }).catch(() => { })
            return message.channel.send(`:x: Action annulée !`)
          }
        }
      })
      collector.on("end", async () => {
        return m.edit({ components: [] }).catch(() => { })
      })
    })
  }
}
const { EmbedBuilder } = require("discord.js");
const { Bots } = require("../../base/Database/Models/Bots");

module.exports = {
  name: "mybot",
  description: "Donne les informations du bot",
  aliases: ['my-bot', 'bot'],
  cooldown: 2,
  run: async (client, message, args, data) => {
      const ownerBots = await Bots.findAll({
        where: {
          owner: message.member.id // Remplacez "ownerId" par l'ID du propriétaire que vous souhaitez récupérer
        }
      });
      let dba = ownerBots.map(i => i)
      if (!dba || dba.length < 1) { message.channel.send(":x: Vous n'avez aucun bot"); }

      const embed = new EmbedBuilder()
        .setTitle('Vos bots')
        .setDescription(`${(await Promise.all(dba.map(async (user) => {
          const botUser = await client.users.fetch(user.botid);
          return `[${botUser.tag}](https://discord.com/api/oauth2/authorize?client_id=${user.botid}&permissions=8&scope=bot%20applications.commands) : <t:${Math.floor((new Date(user.DateStart).getTime() + parseInt(user.Duration)) / 1000)}:R>`;
      }))).join("\n")}`)
      .setColor(data.color)
        .setFooter({ text: "CoinsBot by ⲈpicBots" })
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

  }
}
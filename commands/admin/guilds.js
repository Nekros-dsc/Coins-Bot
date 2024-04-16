const Discord = require("discord.js");
module.exports = {
  name: "guilds",
  description: "Affiche les serveurs où est le bot",
  aliases: ['serveurs'],
  owner: true,
  run: async (client, message, args) => {

    const bot = client;
    let i0 = 0;
    let i1 = 10;
    let page = 1;

    let description =
      `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
      bot.guilds.cache
        .sort((a, b) => b.memberCount - a.memberCount)
        .map(r => r)
        .map(
          (r, i) =>
            `**${i + 1}** - ${r.name} (${r.id}) | Membres: ${r.memberCount}`
        )
        .slice(0, 10)
        .join("\n\n");


    let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('next').setEmoji("▶️")
    let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('back').setEmoji("◀️")

    let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_next])

    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: bot.user.tag, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

      .setFooter({ text: `Page - ${page}/${Math.ceil(bot.guilds.cache.size / 10)}` })
      .setDescription(description);

    await message.reply({
      embeds: [embed],
      components: [button_row],
      allowedMentions: { repliedUser: false }
    }).then(async msg => {
      const collector = message.channel.createMessageComponentCollector({
        componentType: Discord.ComponentTypeButton,
        time: 150000
      })
      collector.on("collect", async (i) => {
        if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces bouttons !", ephemeral: true }).catch(() => { })
        await i.deferUpdate()

        if (i.customId === 'back') {
          i0 = i0 - 10;
          i1 = i1 - 10;
          page = page - 1;

          if (i0 + 1 < 0) {
            return msg.delete();
          }
          description =
            `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
            bot.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map(r => r)
              .map(
                (r, i) =>
                  `**${i + 1}** - ${r.name} | ID: ${r.id}`
              )
              .slice(i0, i1)
              .join("\n\n");

          embed
            .setFooter({
              text:
                `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
            })
            .setDescription(description);

          msg.edit({ embeds: [embed] });
        }

        if (i.customId === 'next') {
          i0 = i0 + 10;
          i1 = i1 + 10;
          page = page + 1;
          if (i1 > bot.guilds.cache.size + 10) {
            return msg.delete();
          }
          if (!i0 || !i1) {
            return msg.delete();
          }
          description =
            `Total des serveurs - ${bot.guilds.cache.size}\n\n` +
            bot.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map(r => r)
              .map(
                (r, i) =>
                  `**${i + 1}** - ${r.name} (${r.id}) | Membres: ${r.memberCount}`
              )
              .slice(i0, i1)
              .join("\n\n");

          embed
            .setFooter({
              text:
                `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
            })
            .setDescription(description);

          msg.edit({ embeds: [embed] });
        }

        await reaction.users.remove(message.author.id);
      });
      collector.on("end", async () => {
        button_row.components[0].setDisabled(true);
        button_row.components[1].setDisabled(true);
        return msg.edit({ embeds: [embed], components: [button_row] }).catch(() => { })
      })
    })
  }
}
  ;


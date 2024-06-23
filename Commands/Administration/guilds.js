const Discord = require('discord.js');

exports.help = {
  name: 'guilds',
  aliases: ['serveurs'],
  description: 'Affiche les serveurs où le bot est présent',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "BUYER"
}
exports.run = async (bot, message, args, config, data) => {
  let guild
  const founder = config.buyers
    if(!founder.includes(message.author.id)) return message.channel.send('Vous devez être propriétaire pour utiliser cette commande !')
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

      const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Liste des serveurs')
          .addOptions(bot.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map(g => ({ label: g.name, description: `${g.memberCount} membres`, value: g.id })).slice(0, 10))
      )


  let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('next').setEmoji("▶️")
  let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('back').setEmoji("◀️")

  let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_next])

  let embed = new Discord.EmbedBuilder()
    .setAuthor({ name: bot.user.tag, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
    .setColor(data.color)
    .setFooter({ text: `Page - ${page}/${Math.ceil(bot.guilds.cache.size / 10)}` })
    .setDescription(description);

  await message.reply({
    embeds: [embed],
    components: [row, button_row],
    allowedMentions: { repliedUser: false }
  }).then(async msg => {
    const collector = message.channel.createMessageComponentCollector({
      componentType: Discord.ComponentType.Button,
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

            const row = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Liste des serveurs')
                .addOptions(bot.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map(g => ({ label: g.name, description: `${g.memberCount} membres`, value: g.id })).slice(i0, i1))
            )

        embed
          .setFooter({
            text:
              `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
          })
          .setDescription(description);

        msg.edit({ embeds: [embed], components: [row, button_row] });
      } else if (i.customId === 'next') {
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

            const row = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Liste des serveurs')
                .addOptions(bot.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map(g => ({ label: g.name, description: `${g.memberCount} membres`, value: g.id })).slice(i0, i1))
            )

        embed
          .setFooter({
            text:
              `Page - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
          })
          .setDescription(description);

        msg.edit({ embeds: [embed], components: [row, button_row] });
      } else if(i.customId == "select") {
        guild = bot.guilds.cache.get(i.values[0])
        if(!guild) return
        let returnButton = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('return').setEmoji("↩️")
        let leaveButton = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('leaveServer').setEmoji("🔴").setLabel(`Quitter ${guild.name}`)
        let inviteButton = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setCustomId('createinvite').setEmoji("📩").setLabel(`Créer une invitation`)
        const embedNew = new Discord.EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setColor(data.color)
        .addFields({ name: `Membres:`, value: `${guild.memberCount} membres` })
        .addFields({ name: `ID:`, value: guild.id})
        .addFields({ name: `Owner:`, value: guild.members.cache.get(guild.ownerId).user.username})

        let button_row2 = new Discord.ActionRowBuilder().addComponents([returnButton, leaveButton, inviteButton])
        msg.edit({ embeds: [embedNew], components: [button_row2]})
      } else if(i.customId == "return") {
        msg.edit({ embeds: [embed], components: [row, button_row]})
      } else if(i.customId == "leaveServer") {
        msg.reply(`:white_check_mark: J'ai quitté ${guild.name}`)
      } else if(i.customId == "createinvite") {
        const url = await guild.channels.cache.random().createInvite().catch(e => false)
        msg.reply(url ? `https://discord.gg/${url.code}` : "Je n'ai pas pu avoir l'URL")
      }
    });
    collector.on("end", async () => {
      return msg.edit(`Expiré !`).catch(() => { })
    })
  })
}
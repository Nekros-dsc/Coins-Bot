const Discord = require('discord.js');

exports.help = {
  name: 'tedit',
  aliases: ['t-edit'],
  description: 'Modifie les informations de la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let team = bot.functions.checkUserTeam(bot, message, args, message.author.id)

    if (!team) return message.channel.send(`:x: Cette team n'existe pas !`)

    let logprice = JSON.parse(data.gain).logo
    let bannerprice = JSON.parse(data.gain).banner
    let finallb = JSON.parse(team.members)
    const memberData = finallb.find(({ user }) => user === message.author.id);
    if (memberData.rank !== "1") return message.channel.send(`:warning: Vous devez être \`Créateur\` de la team pour la modifier !`)

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Faire une action')
          .addOptions([
            {
              label: 'Modifier le nom',
              description: 'Permet de changer le nom de la team',
              value: 'name',
              emoji: "✏️"
            },
            {
              label: 'Modifier la description',
              description: 'Permet de changer la description de la team',
              value: 'desc',
              emoji: "📃"
            }
          ]),
      );

    if (team.rep >= logprice) {
      row.components[0].addOptions([{
        label: 'Modifier le logo',
        description: 'Permet de changer le logo de la team',
        value: 'logo',
        emoji: "👥"
      }]);
    }
    if (team.rep >= bannerprice) {
      row.components[0].addOptions([{
        label: 'Modifier la bannière',
        description: 'Permet de changer la bannière de la team',
        value: 'banner',
        emoji: "🌄"
      }]);
    }
    let dureefiltrer = response => { return response.author.id === message.author.id };
    let name
    message.reply({
      content: 'Chargement...',
      components: [row], allowedMentions: { repliedUser: false }
    }).then(async m => {
      await update(m)
      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 30000
      })
      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
        const value = select.values[0]
        await select.deferUpdate()
        if (value == 'name') {

          message.channel.send(`✏️ Veuillez entrer le **nom** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
          await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 40000, errors: ['time'] })
            .then(cld => {
              var msg = cld.first();
              name = msg.content.replaceAll("@", "a")
            })
          let teamid = await removeNonLetters(name)
          if (name.length >= 25) return message.channel.send(`:x: Le nom peut contenir 25 caractères maximum: action annulée`)
          if (teamid.length <= 2) return message.channel.send(`:x: Nom de team invalide: action annulée`)
          let uwu = (await bot.functions.checkteam(bot, message, args, teamid))
          if (uwu) return message.channel.send(`:x: Ce nom de team est déjà prit !`)
          if (name === "cancel" || name === "Cancel") { update(m); return message.channel.send(`:x: Action annulée`) }
          await team.update({ name: name }, { where: { primary: team.primary }});
          update(m)
          return select.followUp(`✏️ Le nom de la team a bien été modifié !`)
        } else
          if (value == 'desc') {
            message.channel.send(`📃 Veuillez entrer la **description** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
            await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 40000, errors: ['time'] })
              .then(cld => {
                var msg = cld.first();
                desc = msg.content
              })
            if (desc.length > 70) return message.channel.send(`:x: La description peut contenir 70 caractères maximum: action annulée`)
            if (desc === "cancel" || desc === "Cancel") return message.channel.send(`:x: Action annulée`)
            bot.db.prepare(`UPDATE team SET description = @coins WHERE id = @id`).run({ coins: desc.replaceAll("@", "a"), id: team.id});
            update(m)
            return message.channel.send(`📃 La description de la team a bien été modifié !`)

          } else
            if (value == 'logo') {

              message.channel.send(`👥 Veuillez envoyer le **logo** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
              await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 40000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();

                  if (msg.attachments.size > 0) { logo = msg.attachments.first().url } else logo = msg.content
                })
              if (logo === "cancel" || logo === "Cancel") return message.channel.send(`:x: Action annulée`)
              if (!logo.startsWith("http") || !logo.startsWith("https")) return message.channel.send(`:x: Image invalide`)
            bot.db.prepare(`UPDATE team SET logo = @coins WHERE id = @id`).run({ coins: logo, id: team.id});
              update(m)
              return message.channel.send(`👥 Le logo de la team a bien été modifié !`)

            } else if (value == 'banner') {

              message.channel.send(`🌄 Veuillez envoyer la **bannière** de la team:\n(_Tapez \`cancel\` pour annuler l'action en cours_)`)
              await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 40000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();

                  if (msg.attachments.size > 0) { banner = msg.attachments.first().url } else banner = msg.content

                })
              if (banner === "cancel" || banner === "Cancel") return message.channel.send(`:x: Action annulée`)
              if (!banner.startsWith("http") || !banner.startsWith("https")) return message.channel.send(`:x: Image invalide`)
                bot.db.prepare(`UPDATE team SET banner = @coins WHERE id = @id`).run({ coins: banner, id: team.id});
              update(m)
              return message.channel.send(`🌄 La bannière de la team a bien été modifié !`)

            }
      })

    })
    async function update(m) {
      team = bot.functions.checkUserTeam(bot, message, args, message.author.id)
      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `🗽 Panel de modification de la team ${team.name}` })
        .setDescription(`✏️ **Nom:** ${team.name ? team.name : "Aucun"}\n📃 **Description:** ${team.desc ? team.desc : "Aucune"}${team.rep > logprice ? `\n👥 **Logo:** ${team.logo ? `[Logo URL](${team.logo})` : "Aucun"}` : ""}${team.rep > bannerprice ? `\n🌄 **Banner:** ${team.banner ? `[Banner URL](${team.banner})` : "Aucune"}` : ""}`)
        .setColor(data.color)
        .setFooter({ text: `Team ID: ${team.teamid}` })
      if (team.rep >= bannerprice && team.banner) embed.setImage(team.banner)
      if (team.rep >= logprice && team.logo) embed.setThumbnail(team.logo)
      m.edit({
        embeds: [embed], allowedMentions: { repliedUser: false }
      })
    }
}

function removeNonLetters(text) {
    return (text.replace(/[^A-Za-z]/g, '')).toLowerCase()
}
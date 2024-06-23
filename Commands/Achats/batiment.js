const Discord = require('discord.js');

exports.help = {
  name: 'batiment',
  aliases: ['bâtiment' , 'bat' , 'bar' , 'magasin' , 'garage' , 'gare' , 'cinema' , 'entrepot' , 'mairie' , 'batiments'],
  description: 'Affiche votre entrepôt et l\'argent produit par vos bâtiments',
  use: 'Pas d\'utilisation conseillée',
  category: 'Achats'
}
exports.run = async (bot, message, args, config, data) => {
    var items = require("../../Utils/function/shop.json")
    let memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
    let bats = JSON.parse(memberDB.batiment).batiments
    
    let batarray = []
    for (i in items.bat) {
      batarray.push(`**${i}:** ${bats.includes(i) ? "Possédé" : "Non Possédé"}`)
    }

    dureefiltrer = response => { return response.author.id === message.author.id };
    let maxentrepot = JSON.parse(data.gain).entrepotMax
    let total = JSON.parse(memberDB.batiment).count
    if (!total) total = 0
    if (parseInt(total) > parseInt(maxentrepot)) {
        const json = {
            "count": maxentrepot,
            "batiments": JSON.parse(memberDB.batiment).batiments
        }
        bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        total = maxentrepot
    }

    let un = ":red_square:"
    if (total > maxentrepot / 5) un = ":blue_square:"
    let deux = ":red_square:"
    if (total > maxentrepot / 5 * 2) deux = ":blue_square:"
    let trois = ":red_square:"
    if (total > maxentrepot / 5 * 3) trois = ":blue_square:"
    let quatre = ":red_square:"
    if (total > maxentrepot / 5 * 4) quatre = ":blue_square:"
    let cinq = ":red_square:"
    if (total > maxentrepot / 5 * 5 - 1) cinq = ":blue_square:"

    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Faire une action')
          .addOptions([
            {
              label: 'Récolter',
              description: 'Récolte l\argent stocké dans votre entrepot !',
              value: 'recolte',
              emoji: "📤"
            },
            {
              label: 'Vendre',
              description: 'Permets de vendre un batiment',
              value: 'vendre',
              emoji: "📞"
            }
          ]),
      );

    let moneyEmbed = new Discord.EmbedBuilder()
      .setColor(data.color)
      .setAuthor({ name: `Argent dans votre entrepôt: ${total ? total : 0} / ${maxentrepot}` })
      .setThumbnail('https://media.discordapp.net/attachments/1249042420163674153/1249464306291179581/unknown.png?ex=66680e90&is=6666bd10&hm=c3f2510d0ff60ffb3f3d34c42cfeb66a7f17ee4267675a99efd52cfb8199175e&=&format=webp&quality=lossless&width=921&height=921')
      .setDescription(`Statut: ${un}${deux}${trois}${quatre}${cinq}\n
\`📤\` - Récupérer l'argent des batiments 
\`📞\` - Vendre un batiment

\`\`\`                                                                                                    \`\`\`

${batarray.map(i => i.replace(i[2], i[2].toUpperCase())).join("\n")}

_Utilisez la commande \`buy\` pour acheter un ou plusieurs batiments !_`)
      .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
    message.reply({
      embeds: [moneyEmbed],
      components: [row], allowedMentions: { repliedUser: false }
    }).then(m => {

      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 50000
      })
      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
        const value = select.values[0]
        await select.deferUpdate()

        if (value == 'recolte') {
          memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
          total = JSON.parse(memberDB.batiment).count
          if (!total) return message.channel.send(`:x: Vous n'avez pas d'argent dans votre entrepôt !`)
            const json = {
                "count": 0,
                "batiments": JSON.parse(memberDB.batiment).batiments
            }
            bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
            bot.functions.addCoins(bot, message, args, message.author.id, parseInt(total), 'coins')
          message.channel.send({
            embeds: [new Discord.EmbedBuilder()
              .setColor(data.color)
              .setThumbnail('https://media.discordapp.net/attachments/1002173915549937715/1028683967710380072/unknown.png')
              .setDescription(`:coin: \`${total} coins\` ont été retiré de votre entrepôt !`)
              .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })]
          })
          update(m, total)
        } else if (value == 'vendre') {
          let buildings = items.bat
          memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
          bats = JSON.parse(memberDB.batiment).batiments
          m.reply(`Entrez maintenant le nom du bâtiment que vous souhaitez vendre:`);
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              const msg = cld.first();
              if (typeof msg.content !== "string") return message.channel.send(":x: Réponse invalide");
              const content = msg.content.toLowerCase();

              const building = buildings[content];
              if (!building) return message.channel.send(`Action annulée !`);

              const buildingPrice = JSON.parse(data.gain)[content].price;
              const buildingGain = JSON.parse(data.gain)[content].gain;
              if (!bats.includes(content)) return message.channel.send(`:x: Vous n'avez pas de ${content} !`);

              const newArray = bats.filter(b => b !== content)
              const json = {
                "count": total,
                "batiments": newArray
            }
            bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
              let reven = buildingPrice - buildingGain;
              update(m, total);
              message.channel.send(`Vous avez vendu votre **${content}** pour \`${reven} coins\``);
              bot.functions.addCoins(bot, message, args, message.author.id, parseInt(reven), 'coins')
            })
            .catch(console.error);
        }
      })

    })




    async function update(m, total) {
      maxentrepot = JSON.parse(data.gain).entrepotMax
      memberDB = bot.functions.checkUser(bot, message, args, message.author.id)
      total = JSON.parse(memberDB.batiment).count
      if (!total) total = 0
      if (parseInt(total) > parseInt(maxentrepot)) {
        const json = {
            "count": maxentrepot,
            "batiments": JSON.parse(memberDB.batiment).batiments
        }
        bot.db.prepare(`UPDATE user SET batiment = @coins WHERE id = @id`).run({ coins: JSON.stringify(json), id: message.author.id});
        total = maxentrepot
      }
      let un = ":red_square:"
      if (total > maxentrepot / 5) un = ":blue_square:"
      let deux = ":red_square:"
      if (total > maxentrepot / 5 * 2) deux = ":blue_square:"
      let trois = ":red_square:"
      if (total > maxentrepot / 5 * 3) trois = ":blue_square:"
      let quatre = ":red_square:"
      if (total > maxentrepot / 5 * 4) quatre = ":blue_square:"
      let cinq = ":red_square:"
      if (total > maxentrepot / 5 * 5 - 1) cinq = ":blue_square:"
      batarray = []
      for (i in items.bat) {
        batarray.push(`**${i}:** ${bats[i] ? "Possédé" : "Non Possédé"}`)
      }
      m.edit({
        embeds: [new Discord.EmbedBuilder()
          .setColor(data.color)
          .setThumbnail('https://media.discordapp.net/attachments/1249042420163674153/1249464306291179581/unknown.png?ex=66680e90&is=6666bd10&hm=c3f2510d0ff60ffb3f3d34c42cfeb66a7f17ee4267675a99efd52cfb8199175e&=&format=webp&quality=lossless&width=921&height=921')
          .setAuthor({ name: `Argent dans votre entrepôt: ${total ? total : 0} / ${maxentrepot}` })
          .setDescription(`Statut: ${un}${deux}${trois}${quatre}${cinq}\n
\`📤\` - Récupérer l'argent des batiments 
\`📞\` - Vendre un batiment

\`\`\`                                                                                                    \`\`\`

${batarray.map(i => i.replace(i[2], i[2].toUpperCase())).join("\n")}

_Utilisez la commande \`buy\` pour acheter un ou plusieurs batiments !_`)
          .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })], allowedMentions: { repliedUser: false }
      })
    }
}

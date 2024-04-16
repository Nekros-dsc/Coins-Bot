const Discord = require("discord.js");
const getUser = require("../../base/functions/getUser");
const { Users } = require("../../base/Database/Models/Users");

module.exports = {
  name: "batiment",
  description: "Affiche votre entrepôt et l'argent produit par vos bâtiments",
  aliases: ['bâtiment', "bat", 'bar', 'magasin', 'garage', 'gare', 'cinema', "entrepot", "mairie"],

  run: async (client, message, args, data) => {
    var items = require("../../shop.json")
    let memberDB = await getUser(message.member.id, message.guild.id)
    let bats = memberDB.Batiments || {}
    if (typeof bats === 'string') {
      bats = JSON.parse(bats);
      await data.users.update({ Batiments: bats }, { where: { primary: memberDB.primary } });
    }
    let batarray = []
    for (i in items.bat) {
      batarray.push(`**${i}:** ${bats[i] ? "Possédé" : "Non Possédé"}`)
    }

    dureefiltrer = response => { return response.author.id === message.author.id };
    let maxentrepot = data.guild.Max["entrepot"] || 5000
    let total = memberDB.Entrepot
    if (!total) total = 0
    if (parseInt(total) > parseInt(maxentrepot)) {
      Users.update({ Entrepot: maxentrepot }, { where: { primary: memberDB.primary } });
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
      .setThumbnail('https://play-lh.googleusercontent.com/XMpaHMNeySpMO8MAGmkMd0GB0E27hjsai5uKAushFMf8SYcJ_xucp5WUQ2x-ACOUZJ-i')
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
          memberDB = await getUser(message.member.id, message.guild.id)
          total = memberDB.Entrepot
          if (!total) return message.channel.send(`:x: Vous n'avez pas d'argent dans votre entrepôt !`)
          await Users.update({ Entrepot: 0 }, { where: { primary: memberDB.primary } });
          memberDB.increment('Coins', { by: total });
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
          memberDB = await getUser(message.member.id, message.guild.id)
          bats = memberDB.Batiments || {}
          m.reply(`Entrez maintenant le nom du bâtiment que vous souhaitez vendre:`);
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              const msg = cld.first();
              if (typeof msg.content !== "string") return message.channel.send(":x: Réponse invalide");
              const content = msg.content.toLowerCase();

              const building = buildings[content];
              if (!building) return message.channel.send(`Action annulée !`);

              const buildingPrice = data.guild.Prices[`${content}price`] || building.price;
              const buildingGain = data.guild.Prices[`${content}gain`] || building.gain;
              if (!bats[content]) return message.channel.send(`:x: Vous n'avez pas de ${content} !`);

              delete bats[content]
              await data.users.update({ Batiments: bats }, { where: { primary: memberDB.primary } });
              let reven = buildingPrice - buildingGain;
              update(m, total);
              message.channel.send(`Vous avez vendu votre **${content}** pour \`${reven} coins\``);
              memberDB.increment('Coins', { by: reven });
            })
            .catch(console.error);
        }
      })

    })




    async function update(m, total) {
      maxentrepot = data.guild.Max["entrepot"] || 5000
      memberDB = await getUser(message.member.id, message.guild.id)
      total = memberDB.Entrepot
      if (!total) total = 0
      if (parseInt(total) > parseInt(maxentrepot)) {
        Users.update({ Entrepot: maxentrepot }, { where: { primary: memberDB.primary } });
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
          .setThumbnail('https://play-lh.googleusercontent.com/XMpaHMNeySpMO8MAGmkMd0GB0E27hjsai5uKAushFMf8SYcJ_xucp5WUQ2x-ACOUZJ-i')
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
};


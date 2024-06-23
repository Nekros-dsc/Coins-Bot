const Discord = require('discord.js');

exports.help = {
  name: 'items',
  aliases: ['add-items'],
  description: 'Modifie le shop du serveur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Administration',
  perm: "OWNER"
}
exports.run = async (bot, message, args, config, data) => {
    const dureefiltrer = response => response.author.id === message.author.id;
    let difarr = JSON.parse(data.cshop)

    message.reply("Chargement...").then(async m => {
      await update(m, difarr)
      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 90000
      });
      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { });
        const value = select.values[0];
        await select.deferUpdate();
        data = bot.functions.checkGuild(bot, message, message.guild.id)
        let difarr = JSON.parse(data.cshop)

        if (value === 'remove') {
          message.channel.send(`:eyes: Veuillez entrer le nom de l'item à retirer:`);
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              const msg = cld.first();
              const number = msg.content.toLowerCase()
              if (!difarr.some(j => j.name?.toLowerCase() == number)) {
                update(m, difarr);
                return message.channel.send(":x: Aucun item avec ce nom !");
              }
              const type = difarr.filter(j => j.name.toLowerCase() == number)
              difarr = difarr.filter(j => j.name.toLowerCase() !== number)
              bot.db.prepare(`UPDATE guild SET cshop = @coins WHERE id = @id`).run({ coins: JSON.stringify(difarr), id: message.guild.id});

              const embed = new Discord.EmbedBuilder()
                .setTitle("Item retiré !")
                .setDescription(`Nom: ${type[0].name}\nPrix: ${type[0].cost}\nRôle: <@&${type[0].id}>`)
                .setColor(data.color);
              await update(m, difarr);
              return message.channel.send({ embeds: [embed] });
            });
        } else if (value === 'add') {
          let name = null;
          let cost = null;
          let id = null;

          message.channel.send(`:eyes: Veuillez entrer le **nom** de l'item:`);
          await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
              const msg = cld.first();
              name = msg.content;
            });

          message.channel.send(`:eyes: Veuillez entrer le **prix** de l'item (minimum 10 coins):`);
          await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
              const msg = cld.first();
              if (isNaN(msg.content)) {
                update(m, difarr);
                return message.channel.send(`:x: Ceci n'est pas un chiffre: action annulée`);
              }
              if (msg.content < 10) {
                update(m, difarr);
                return message.channel.send(`:x: L'item doit coûter 10 coins minimum: action annulée`);
              }
              cost = msg.content;
            });

          if (cost === null) return;
          message.channel.send(`:eyes: Veuillez mentionner ou entrer l'ID du **rôle** donné avec l'item:`);
          await message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
              const msg = cld.first();
              const role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content);
              if (!role) {
                update(m, difarr);
                return message.channel.send(`:x: Je n'ai pas trouvé ce rôle: action annulée`);
              }
              if (message.guild.members.cache.get(bot.user.id).roles.highest.comparePositionTo(role) < 0) {
                return message.channel.send(`:x: Mon rôle n'est pas assez haut pour ajouter **${role.name}** !`);
              }
              if (message.member.roles.highest.comparePositionTo(role) < 0) {
                return message.channel.send(`:x: Vous devez être supérieur au rôle **${role.name}** !`);
              }
              id = role.id;
            });

          if (id === null) return;

          difarr.push({ name: name, cost: cost, id: id })

          bot.db.prepare(`UPDATE guild SET cshop = @coins WHERE id = @id`).run({ coins: JSON.stringify(difarr), id: message.guild.id});

          const embed = new Discord.EmbedBuilder()
            .setTitle("Item ajouté !")
            .setDescription(`Nom: ${name}\nPrix: ${cost}\nRôle: <@&${id}>`)
            .setColor(data.color);
          update(m, difarr);
          return message.channel.send({ embeds: [embed] });
        }
      });
    })

    function update(m, difarr) {
        let itemsList = difarr.map(key => [key, key]);
  
        itemsList = itemsList.map(r => r)
          .map((m, i) => `${i + 1}) ${m[1].name} (<@&${m[1].id}>)\nPrix: \`${m[1].cost} coins\``)
        itemsList = itemsList.length > 0 ? itemsList.slice(0, 31).join("\n") : "Aucun item n'a été ajouté dans le shop du serveur !";
  
        const row = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.StringSelectMenuBuilder()
              .setCustomId('select')
              .setPlaceholder('Faire une action')
              .addOptions([
                {
                  label: 'Ajouter',
                  description: 'Ajoute un item',
                  value: 'add',
                  emoji: "➕",
                },
                {
                  label: 'Retirer',
                  description: 'Retire un item',
                  value: 'remove',
                  emoji: "➖",
                }
              ]),
          );
  
        const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: `Panel de configuration du shop de ${message.guild.name}` })
          .setDescription(itemsList)
          .addFields({ name: '➕', value: 'Ajoute un rôle au shop', inline: true})
          .addFields({ name: '➖', value: 'Retire un rôle du shop', inline: true})
          .setColor(data.color)
          .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
        m.edit({ content: " ", embeds: [embed], components: [row] });
      }
}
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const checkGuild = require("../../base/functions/checkGuild");


module.exports = {
  name: "items",
  description: "Modifie le shop du serveur",
  aliases: ['add-items'],
  cooldown: 2,
  owner: true,
  run: async (client, message, args, data) => {
    const dureefiltrer = response => response.author.id === message.author.id;
    data.guild.cshop = data.guild.cshop || {}

    message.reply("Chargement...").then(async m => {
      await update(m)
      const collector = m.createMessageComponentCollector({
        componentType: Discord.ComponentType.SelectMenu,
        time: 90000
      });
      collector.on("collect", async (select) => {
        if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { });
        const value = select.values[0];
        await select.deferUpdate();
        data.guild = await checkGuild(client.user.id, message.guild.id)
        const difarr = data.guild.cshop || {}

        if (value === 'remove') {
          message.channel.send(`:eyes: Veuillez entrer le numéro de l'item à retirer:`);
          message.channel.awaitMessages({ filter: dureefiltrer, max: 1, time: 30000, errors: ['time'] })
            .then(async cld => {
              const msg = cld.first();
              const number = msg.content.toLowerCase()

              let foundItem = Object.entries(difarr).find(([itemId, itemData]) => {
                return itemData.name.toLowerCase() === number;
              });
              if (!foundItem) {
                update(m);
                return message.channel.send(":x: Aucun item avec ce nom !");
              }
              delete difarr[foundItem[1].id]
              await data.guilds.update({ cshop: difarr }, { where: { guildId: message.guild.id }});

              const embed = new EmbedBuilder()
                .setTitle("Item retiré !")
                .setDescription(`Nom: ${foundItem[1].name}\nPrix: ${foundItem[1].cost}\nRôle: <@&${foundItem[1].id}>`)
                .setColor(data.color);
              await update(m);
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
                update(m);
                return message.channel.send(`:x: Ceci n'est pas un chiffre: action annulée`);
              }
              if (msg.content < 10) {
                update(m);
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
                update(m);
                return message.channel.send(`:x: Je n'ai pas trouvé ce rôle: action annulée`);
              }
              if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                return message.channel.send(`:x: Mon rôle n'est pas assez haut pour ajouter **${role.name}** !`);
              }
              if (message.member.roles.highest.comparePositionTo(role) < 0) {
                return message.channel.send(`:x: Vous devez être supérieur au rôle **${role.name}** !`);
              }
              id = role.id;
            });

          if (id === null) return;

          difarr[id] = { name: name, cost: cost, id: id };

          await data.guilds.update({ cshop: difarr }, { where: { guildId: message.guild.id }});

          const embed = new EmbedBuilder()
            .setTitle("Item ajouté !")
            .setDescription(`Nom: ${name}\nPrix: ${cost}\nRôle: <@&${id}>`)
            .setColor(data.color);
          update(m);
          return message.channel.send({ embeds: [embed] });
        }
      });
    })
    function update(m) {
      let difarr = data.guild.cshop || {}
      let itemsList = Object.keys(difarr).map(key => [key, difarr[key]]);

      itemsList = itemsList.map(r => r)
        .map((m, i) => `${i + 1}) ${m[1].name} (<@&${m[1].id}>)\nPrix: \`${m[1].cost} coins\``)
      itemsList = itemsList.length > 0 ? itemsList.slice(0, 31).join("\n") : "Aucun item n'a été ajouté dans le shop du serveur !";

      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
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

      const embed = new EmbedBuilder()
        .setAuthor({ name: `Panel de configuration du shop de ${message.guild.name}` })
        .setDescription(itemsList)
        .addField('➕', 'Ajoute un rôle au shop', true)
        .addField('➖', 'Retire un rôle du shop', true)
        .setColor(data.color)
        .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });
      m.edit({ content: " ", embeds: [embed], components: [row] });
    }
  }
};

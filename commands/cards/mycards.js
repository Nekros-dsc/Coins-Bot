const Discord = require("discord.js");
const { webhook, generateCanva } = require("../../base/functions");
const { Cards } = require("../../base/Database/Models/Cards");

module.exports = {
  name: "mycard",
  description: "Affiche les cartes",
  usage: "mycards",
  cooldown: 3,
  aliases: ['cards', 'card', 'mycards'],

  run: async (client, message, args, data) => {
    let actuale = await Cards.findAll({
      where: {
        guildId: message.guild.id
      }
    });

    let propriocards = actuale.filter(u => u.proprio === message.member.id);

    if (!propriocards || propriocards.length <= 0) {
      let chan = data.guild.Logs["cards"]
      chan = message.guild.channels.cache.get(chan)
      if (!chan) {
        return message.reply(`:x: Le système de carte est désactivé, vous ne pouvez plus collecter de cartes.`);
      }
      return message.reply(`:x: Vous n'avez pas de carte, voici les salons où les cartes sont drop aléatoirement: ${chan} !`);
    }

    let buttontrash = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('trash').setEmoji("🗑️");
    let button_row = new Discord.ActionRowBuilder().addComponents([buttontrash]);

    let pages = [];
    let currentPage = 0;

    await message.reply({
      content: "Chargement...",
      allowedMentions: { repliedUser: false }
    })
      .then(async msg => {
        for (let i = 0; i < propriocards.length; i++) {
          let card = propriocards[i];
          let [embed, attachment] = await pagination(card);
          pages.push({ embed, attachment });
        }

        msg.edit({
          content: " ",
          embeds: [pages[0].embed],
          files: [pages[0].attachment],
          components: [button_row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: Discord.ComponentType.Button,
          time: 150000
        });

        collector.on("collect", async (interaction) => {
          if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { });
          await interaction.deferUpdate();

          if (interaction.customId === 'next') {
            if (currentPage >= pages.length - 1) {
              currentPage = 0;
            } else {
              currentPage++;
            }

            pages[currentPage].embed.setFooter(`Page ${currentPage + 1}/${pages.length} | By Millenium is here#4444`, client.user.displayAvatarURL());
            msg.edit({ embeds: [pages[currentPage].embed] });
          } else if (interaction.customId === 'back') {
            if (currentPage <= 0) {
              currentPage = pages.length - 1;
            } else {
              currentPage--;
            }

            pages[currentPage].embed.setFooter(`Page ${currentPage + 1}/${pages.length} | By Millenium is here#4444`, client.user.displayAvatarURL());
            msg.edit({ embeds: [pages[currentPage].embed] });
          } else if (interaction.customId.startsWith('trash-')) {
            let cardName = interaction.customId.split("-")[1];
            let button = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId(`check-${cardName}`).setEmoji("✅");
            let buttonRow = new Discord.ActionRowBuilder().addComponents([button]);

            msg.edit({ content: `:question: Êtes-vous sûr de vouloir jeter la carte **${cardName}** ?\nAction irréversible, cette carte sera de nouveau drop plus tard !`, embeds: [], components: [buttonRow], files: [] });
          } else if (interaction.customId.startsWith('check-')) {
            let cardName = interaction.customId.split("-")[1];
            let findCard = actuale.find(u => u.name === cardName && u.proprio === message.member.id);
            if (!findCard) return interaction.followUp({ content: `:x: Cette carte n'existe pas`, ephemeral: true });

            findCard.proprio = false;
            await findCard.save();

            return msg.edit({ content: `:white_check_mark: Vous avez jeté votre carte ${cardName} !`, components: [] });
          }
        });

        collector.on("end", async () => {
          button_row.components[0].setDisabled(true);
          return msg.edit({ embeds: [pages[currentPage].embed], components: [button_row], files: [] }).catch(() => { });
        });
      });

    async function pagination(card) {
      const attachment = await generateCanva(card, card.name, data.color);

      const embed = new Discord.EmbedBuilder()
        .setTitle(card.name)
        .setAuthor(`Voici votre carte`)
        .addFields([
          { name: `Puissance`, value: `\`\`\`js\n${card.vie + card.defense + card.attaque}/150\`\`\`` },
          { name: `Attaque`, value: `\`\`\`js\n${card.attaque}/50\`\`\`` },
          { name: `Défense`, value: `\`\`\`js\n${card.defense}/50\`\`\`` },
          { name: `Vie`, value: `\`\`\`js\n${card.vie}/50\`\`\`` }
        ])
        .setImage("attachment://attach.png");

      button_row.components[0].setCustomId(`trash-${card.name}`);

      return [embed, attachment];
    }
  }
};

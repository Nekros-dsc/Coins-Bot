const { Cards } = require('../base/Database/Models/Cards');
module.exports = {
  name: 'interactionCreate',

  run: async (client, interaction) => {
    if (interaction && interaction.customId) {
      if (interaction.customId.startsWith("cardclaim")) {
        let name = interaction.customId.split("-")[1];

        let actuale = await Cards.findAll({
          where: {
            guildId: interaction.guild.id
          }
        });

        let propriocards = actuale.filter(u => u.proprio === interaction.user.id);
        if (propriocards.length >= 1) {
          return interaction.reply({ content: `:x: Vous ne pouvez avoir qu'une seule carte !`, ephemeral: true });
        }

        interaction.message.components[0].components[0].disabled = true;
        await interaction.message.edit({ components: [interaction.message.components[0]] });

        let findcard = actuale.find(u => u.name === name);
        if (!findcard) {
          return interaction.reply({ content: `:x: Cette carte n'existe pas.`, ephemeral: true });
        }

        if (findcard.proprio) {
          return interaction.reply({ content: `:x: Cette carte appartient déjà à <@${findcard.proprio}>.`, ephemeral: true });
        }

        findcard.proprio = interaction.user.id;
        await Cards.update({ proprio: interaction.user.id }, {
          where: {
            name: findcard.name,
            guildId: findcard.guildId
          }
        });

        return interaction.reply(`🃏 La carte \`${name}\` a bien été réclamée par ${interaction.user} !`);
      }
    }
  }
};

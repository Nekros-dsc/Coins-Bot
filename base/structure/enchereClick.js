const { Encheres } = require("../Database/Models/Encheres");
const getUser = require("../functions/getUser");

module.exports = {
    name: 'interactionCreate',

    run: async (client, interaction) => {
        if (interaction && interaction.customId) {
            if (interaction.customId.startsWith("enchere")) {
                let name = interaction.customId.split("-")[1]
                const enchere = await Encheres.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        MessageId: name
                    }
                });
                if (enchere) {
                    if (interaction.member.id === enchere.encherisseur) return interaction.reply({ content: `:x: ${interaction.member}, vous êtes déjà le dernier enchérisseur !`, ephemeral: true })

                    let encherisseurDB = await getUser(interaction.member.id, interaction.guild.id)
                    let price = parseInt(enchere.lastenchere)

                    let result = price + parseInt(enchere.click)
                    if (encherisseurDB.Bank < result) {
                        return interaction.reply({ content: `:x: ${interaction.member}, vous avez besoin de \`\`${result} coins\`\` en banque pour enchérir !`, ephemeral: true })
                    }


                    let dernierencherisseur = enchere.encherisseur
                    if (dernierencherisseur) {
                        let encherisseur = await getUser(dernierencherisseur, interaction.guild.id)
                        encherisseur.increment('Bank', { by: enchere.lastenchere });
                    }

                    enchere.increment('lastenchere', { by: enchere.click });
                    Encheres.update({ encherisseur: interaction.member.id }, { where: { id: enchere.id }});

                    encherisseurDB.decrement('Bank', { by: result });
                    interaction.reply(`${interaction.member}, vient d'enchérir pour **${result}** coins !`).then(msg => {              
                        setTimeout(() => {
                            interaction.deleteReply().catch(console.error);
                        }, 5000);
                      })
                      .catch(console.error);


                }
            }
        }
    }
}
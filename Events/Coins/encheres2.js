module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot) {
        if (interaction && interaction.customId) {
            if (interaction.customId.startsWith("enchere")) {
                let name = interaction.customId.split("-")[1]
                const enchere = bot.db.prepare('SELECT * FROM Encheres WHERE guildId = ? AND MessageId = ?').get(interaction.guild.id, name)
                if (enchere) {
                    if (interaction.member.id === enchere.encherisseur) return interaction.reply({ content: `:x: ${interaction.member}, vous êtes déjà le dernier enchérisseur !`, ephemeral: true })

                    let encherisseurDB = bot.functions.checkUser(bot, null, null, interaction.user.id)
                    let price = parseInt(enchere.lastenchere)

                    let result = price + parseInt(enchere.click)
                    if (JSON.parse(encherisseurDB.coins).bank < result) {
                        return interaction.reply({ content: `:x: ${interaction.member}, vous avez besoin de \`\`${result} coins\`\` en banque pour enchérir !`, ephemeral: true })
                    }


                    let dernierencherisseur = enchere.encherisseur
                    if (dernierencherisseur) {
                        bot.functions.addCoins(bot, null, null, interaction.user.id, parseInt(enchere.lastenchere), 'bank');
                    }

                    bot.db.prepare(`UPDATE Encheres SET lastenchere = @coins WHERE num = @id`).run({ coins: Number(enchere.click) + Number(enchere.lastenchere), id: enchere.num});
                    bot.db.prepare(`UPDATE Encheres SET encherisseur = @coins WHERE num = @id`).run({ coins: interaction.member.id, id: enchere.num});

                    bot.functions.addCoins(bot, null, null, interaction.user.id, parseInt(result), 'bank');
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
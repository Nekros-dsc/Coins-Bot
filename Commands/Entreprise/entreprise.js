const Discord = require('discord.js');

exports.help = {
  name: 'entreprise',
  aliases: ['entreprises' , 'entr'],
  description: 'Affiche votre entrepôt et l\'argent produit par vos bâtiments',
  use: 'Pas d\'utilisation conseillée',
  category: 'Entreprise'
}
exports.run = async (bot, message, args, config, data) => {
    const user = bot.functions.checkUser(bot, message, args, message.author.id)
    let req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id) || bot.db.prepare('SELECT * FROM entreprise WHERE id = ?').get(user.entrepot)
    if(!req?.user) req = bot.functions.checkEntreprise(bot, message, args, `de ${message.author.username}`), bot.db.prepare(`UPDATE user SET entrepot = @salaire WHERE id = @id`).run({ salaire: `de ${message.author.username}`, id: message.author.id })
    const blue = Math.floor(req.argent / (JSON.parse(data.gain).entrepriseMax / 7));
    const red = 7 - blue;

    let progressBar = '🟦'.repeat(blue) + '🟥'.repeat(red);

    const MenuSelect = new Discord.StringSelectMenuBuilder()
    .setCustomId('manageEntreprise')
    .setDisabled(false)
    .setPlaceholder('Gérer l\'entreprise')
    .addOptions(
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Renommer')
        .setValue('rename')
        .setDescription('Modifie le nom de votre entreprise !')
        .setEmoji('🗂️'),
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Récolter')
        .setValue('recolt')
        .setDescription('Récolte l\‘argent de votre entreprise !')
        .setEmoji('📤'),
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Acheter')
        .setValue('buy')
        .setDescription(`Achète un nouveau bâtiment (${Math.pow(2, req.batiments) * 1000} coins) !`)
        .setEmoji('🛒'),
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Vendre')
        .setValue('sell')
        .setDescription('Vend un bâtiment (1000)')
        .setEmoji('📞')
    );

    const MenuSelect2 = new Discord.StringSelectMenuBuilder()
    .setCustomId('manageEmploye')
    .setDisabled(false)
    .setPlaceholder('Gérer les employés')
    .addOptions(
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Salaire')
        .setValue('salaire')
        .setDescription('Modifie le salaire par employé !')
        .setEmoji('🤑'),
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Employés')
        .setValue('employe')
        .setDescription('Affiche les employés !')
        .setEmoji('📕'),
    );

    const MenuSelect3 = new Discord.StringSelectMenuBuilder()
    .setCustomId('leavePanel')
    .setDisabled(false)
    .setPlaceholder('Faire une action')
    .addOptions(
        new Discord.StringSelectMenuOptionBuilder()
        .setLabel('Quitter')
        .setValue('leave')
        .setDescription('Quitte l\'entreprise !')
        .setEmoji('🚪'),
    );
    const msg = await message.reply({ embeds: [embed()], components: req.author == message.author.id ? [new Discord.ActionRowBuilder().addComponents(MenuSelect), new Discord.ActionRowBuilder().addComponents(MenuSelect2)] : [new Discord.ActionRowBuilder().addComponents(MenuSelect3)]})

    const filter = (i) => {
        if(i.user.id == message.author.id) {
            return true;
        } else {
            return i.reply({ content: `Vous n'avez pas les permissions`, ephemeral: true })
        }
    }
    const collector = msg.createMessageComponentCollector({ filter, time: 120000 });

    collector.on('collect', async (i) => {
        if(i.user.id !== message.author.id) return;
        if(i.customId == "leavePanel") {
            if(req.author == message.author.id) bot.db.prepare('DELETE FROM entreprise WHERE author = ?').run(message.author.id)
            else JSON.parse(req.user).filter(u => u !== message.author.id), bot.db.prepare(`UPDATE entreprise SET user = @user WHERE id = @id`).run({ user: JSON.stringify(req.user), id: req.id});
            bot.db.prepare(`UPDATE user SET entrepot = @salaire WHERE id = @id`).run({ salaire: null, id: i.user.id })
            i.reply(`🚪 Vous avez démissioné avec succès !`)
            msg.edit({ components: [] })
        } else if(i.customId == "manageEmploye") {
            if(i.values[0] == "employe") {
                if(JSON.parse(req.user).length == 0) return i.reply({ content: `:x: Votre entreprise n'a aucun ouvrier !\n*Recrutez en grâce à la commande \`recruter\` !*`, ephemeral: true })
                else return i.reply({ content: `> Voici les employés de l'entreprise:\n${JSON.parse(req.user).map(u => `- <@${u}>`).join('\n')}`, ephemeral: true })
            } else {
                await i.reply({ content: `📃 Veuillez entrer le nouveau salaire versé à vos employés à chaque \`work\`:\n*(Tapez \`cancel\` pour annuler l'action en cours)*`, ephemeral: true })
                const filter2 = response => response.author.id === i.user.id;

                const collector = i.channel.createMessageCollector({ filter2, time: 60000, max: 1 });

                collector.on('collect', message => {
                    message.delete()
                    if(message.content == "cancel") msg.edit({ })
                    else if(isNaN(message.content) || message.content < 0 || message.content > 10000) return i.followUp({ content: `:x: Le salaire doit être un chiffre valide compris entre 0 et 10000 !`, ephemeral: true }), msg.edit({ })
                    else bot.db.prepare(`UPDATE entreprise SET salaire = @salaire WHERE author = @id`).run({ salaire: message.content, id: message.author.id }), req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id), msg.edit({ embeds: [embed()]})
                })
            }
        } else if(i.customId == 'manageEntreprise') {
            if(i.values[0] == "rename") {
                await i.reply({ content: `📃 Veuillez entrer le nouveau nom de l'entreprise:\n*(Tapez \`cancel\` pour annuler l'action en cours)*`, ephemeral: true })
                const filter2 = response => response.author.id === i.user.id;
    
                const collector = i.channel.createMessageCollector({ filter2, time: 60000, max: 1 });
    
                collector.on('collect', message => {
                    message.delete()
                    if(message.content == "cancel") msg.edit({ })
                    else if(message.content.length > 25) return i.followUp({ content: `:x: Le nom peut contenir 25 caractères maximum: action annulée`, ephemeral: true }), msg.edit({ })
                    else bot.db.prepare(`UPDATE entreprise SET id = @salaire WHERE author = @id`).run({ salaire: message.content, id: message.author.id }), req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id), msg.edit({ embeds: [embed()]})
                })
            } else if(i.values[0] == "recolt") {
                const embed = new Discord.EmbedBuilder()
                .setColor(data.color)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`:coin: \`${req.argent} coins\` ont été retiré de votre entrepôt !`)
                .setThumbnail('https://media.discordapp.net/attachments/1249042420163674153/1249464306291179581/unknown.png?ex=666765d0&is=66661450&hm=403f9b4a9d866328c3ee28b64781fbfa7ecef778447b37e3dc8014c9727ac002&=&format=webp&quality=lossless&width=921&height=921')

                bot.db.prepare(`UPDATE entreprise SET argent = @argent WHERE author = @id`).run({ argent: 0, id: message.author.id })
                bot.functions.addCoins(bot, message, args, message.author.id, req.argent, 'coins')

                i.reply({ embeds: [embed], ephemeral: true })
            } else if(i.values[0] == "buy") {
                if(Math.pow(2, req.batiments) * 1000 > req.argent) return i.reply({ content: `:x: Vous n'avez pas assez de coins en entrepot d'entreprise pour construire le prochain bâtiment !`})
                else bot.db.prepare(`UPDATE entreprise SET batiments = @salaire, argent = @argent WHERE author = @id`).run({ salaire: Math.round(req.batiments + 1), argent: req.argent - (Math.pow(2, req.batiments) * 1000), id: message.author.id }), req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id), msg.edit({ embeds: [embed()]})
            } else if(i.values[0] == "sell") {
                if(req.batiments == 1) return i.reply({ content: `:x: Vous n'avez pas de bâtiment à vendre !`})
                else bot.db.prepare(`UPDATE entreprise SET batiments = @salaire WHERE author = @id`).run({ salaire: Math.round(req.batiments - 1), id: message.author.id }), bot.functions.addCoins(bot, message, args, message.author.id, 1000, 'coins'), req = bot.db.prepare('SELECT * FROM entreprise WHERE author = ?').get(message.author.id), msg.edit({ embeds: [embed()]})
            }
        }
    })

    collector.on('end', async () => {
        msg.edit({ components: [] })
    })

    function embed() {
        const embed = new Discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(`Entreprise ${req.id}`)
        .setThumbnail(`https://media.discordapp.net/attachments/1249042420163674153/1249364287814631474/boss.png?ex=666708aa&is=6665b72a&hm=506f4feec12249657ec7af425c4a45903ffe25f5645db3aa3cfb8e6f5a9cae02&=&format=webp&quality=lossless&width=404&height=404`)
        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`
        **Statut:** ${progressBar}
        ┖ Argent dans l'entrepot de team: ${Math.round(req.argent)} / ${JSON.parse(data.gain).entrepriseMax}
        ┖ Revenu net: **${((req.batiments * 500) - (req.batiments * 50)) * JSON.parse(req.user).length == 0 ? 1 : 1 + 0.012 * JSON.parse(req.user).length - req.salaire * 10} coins**
        \`\`\` \`\`\`\n# Propriétaire de l'entreprise: <@${req.author}>
        - :factory: **__Nombre de batiments:__ ${req.batiments}**
         - Revenu: \`+ ${req.batiments * 500} coins\`
         - Frais: \`- ${req.batiments * 50} coins\`
    
        - 🦺 **__Employé:__ ${JSON.parse(req.user).length}**
         - Salaire: \`- ${JSON.parse(req.user).length * req.salaire} coins\` (${req.salaire} / employé)\n - Multiplicateur: \`x ${JSON.parse(req.user).length == 0 ? 1 : 1 + 0.012 * JSON.parse(req.user).length}\`\n
        > **L'entrepôt de l'entreprise se remplira de \`${req.batiments * 500 - req.batiments * 50} coins\` dans ${Math.round(req.work)} \`work\`**
    
        > Chaque employé gagne **${req.salaire} coins** de l'entrepot d'entreprise à chaque \`work\`
        `)
        return embed
    }

}
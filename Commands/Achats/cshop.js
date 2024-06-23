const Discord = require('discord.js');

exports.help = {
  name: 'cshop',
  aliases: ['servershop' , 'customshop'],
  description: 'Permet d\'acheter les rôles du shop du serveur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Achats'
}
exports.run = async (bot, message, args, config, data) => {
    let shop = JSON.parse(data.cshop), number = 0
    if (shop.length > 0) {
        const roww = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Sélectionner un item à acheter')
            );
        let difarr = shop.sort((a, b) => b.cost - a.cost).map((x) => {
            roww.components[0].addOptions([
                {
                    label: `${x.name}`,
                    description: `Prix: ${x.cost}`,
                    value: `${x.id}-${number}`
                }
            ]);
            number++
            return `${x.name} ( <@&${x.id}> ) \n \`Prix: ${x.cost} coins\``;
        });

        let embeds = {};
        let page = 0;

        const size = 10;
        let memberarray = [];

        for (let i = 0; i < difarr.length; i += size) {
            const allMembers = difarr.slice(i, i + size);
            memberarray.push(allMembers);
        }
        memberarray.forEach((chunk, i) => embeds[i] = chunk);

        const row = new Discord.ActionRowBuilder().addComponents([
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('⬅️')
                .setCustomId('left'),
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('➡️')
                .setCustomId('right'),
        ])

        let embed = new Discord.EmbedBuilder()
        embed.setTitle(`${difarr.length > 1 ? `Voici la liste des items du serveur (${difarr.length})` : `Voici l'item du serveur (1)`}`)
        embed.setColor(data.color)
        embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })
        embed.setDescription(embeds[0].join('\n'));
        let compo = [roww]
        if (memberarray.length > 1) {
            compo = [row, roww]
        }
        await message.reply({
            embeds: [embed],
            components: compo
        }).then(messages => {

            const collector = messages.createMessageComponentCollector({
                componentType: Discord.ComponentTypeButton,
                time: 120000,
            })
            collector.on("collect", async (interaction) => {
                if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                await interaction.deferUpdate();
                data = bot.functions.checkGuild(bot, message, message.guild.id)
                shop = JSON.parse(data.cshop)
                if (interaction.customId === "left") {
                    if (page == parseInt(Object.keys(embeds).shift())) page = parseInt(Object.keys(embeds).pop())
                    else page--;
                    embed.setDescription(embeds[page].join('\n'))
                    embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })

                    messages.edit({
                        embeds: [embed],
                        components: [row]
                    }).catch(() => null)
                }

                if (interaction.customId === "right") {
                    if (page == parseInt(Object.keys(embeds).pop())) page = parseInt(Object.keys(embeds).shift())
                    else page++;
                    embed.setDescription(embeds[page].join('\n'))
                    embed.setFooter({ text: `Page ${page + 1}/${memberarray.length}` })

                    messages.edit({
                        embeds: [embed],
                        components: [row]
                    }).catch(() => null)
                }

            });
            const collectorr = messages.createMessageComponentCollector({
                componentsType: Discord.ComponentType.SelectMenu,
                time: 120000
            })
            collectorr.on("collect", async (select) => {
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0].split('-')[0]

                let item = shop.filter(j => j.id == value)
                roww.components[0].setDisabled(true);
                let bal = JSON.parse(bot.functions.checkUser(bot, message, args, message.author.id).coins).coins
                if (item.length == 0) { message.reply({ content: ":x: Cet item n'existe pas !", allowedMentions: { repliedUser: false } }); return }

                const moneymore = new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setDescription(`:x: Vous n'avez pas assez de coins`)
                    .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                if (item[0].cost > bal) { return message.reply({ embeds: [moneymore] }).catch(e => { console.log(e)}); }

                let role = message.guild.roles.cache.get(item[0].id)
                if (!role) {
                    shop = shop.filter(j => j.id !== value)
                    bot.db.prepare(`UPDATE guild SET cshop = @coins WHERE id = @id`).run({ coins: JSON.stringify(shop), id: message.guild.id});
                    return message.channel.send(`:x: Je n'ai pas trouvé ce rôle: item supprimé du shop`);
                }
                if (message.member.roles.cache.has(role.id)) return message.channel.send(":x: Vous avez déjà ce rôle !")
                    bot.functions.removeCoins(bot, message, args, message.author.id, item[0].cost, 'coins')
                message.member.roles.add(role.id).catch(e => { return message.channel.send(`:x: Je n'ai pas pu ajouter ce rôle !\nContactez un administrateur du serveur et vérifiez mes permissions !`) })
                message.reply(`Vous venez d'acheter un \`${item[0].name}\` pour \`${item[0].cost} coins\` et avez reçu le rôle **${role.name}** !`)
                roww.components[0].setDisabled(false);
            })
            collector.on("end", async () => {
                return messages.edit({ content: "Expiré !", components: [] }).catch(() => { })
            })
        })
    } else return message.reply(`:x: Aucun item n'a été ajouté au shop du serveur !\nUtilisez la commande \`${data.prefix}items\` pour en ajouter !`)
}
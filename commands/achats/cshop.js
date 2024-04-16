const Discord = require('discord.js');
const getUser = require("../../base/functions/getUser");
const removeCoins = require("../../base/functions/removeCoins");

module.exports = {
    name: "cshop",
    description: "Permet d'acheter les rôles du shop du serveur",
    aliases: ['servershop', 'customshop'],

    run: async (client, message, args, data) => {
        client.queue.addJob(async (cb) => {
            let shop = data.guild.cshop || {}
            if (Object.keys(shop).length > 0) {
                const roww = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Sélectionner un item à acheter')
                    );
                let difarr = Object.values(shop).sort((a, b) => b.cost - a.cost).map((x) => {
                    roww.components[0].addOptions([
                        {
                            label: `${x.name}`,
                            description: `Prix: ${x.cost}`,
                            value: `${x.id}`
                        }
                    ]);
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
                        data.guild = await checkGuild(client.user.id, message.guild.id)
                        shop = data.guild.cshop || {}
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
                        cb()
                        const value = select.values[0]
                        await select.deferUpdate()
                        let item = shop[value]
                        roww.components[0].setDisabled(true);
                        let bal = (await getUser(message.member.id, message.guild.id)).Coins
                        if (!item) { message.reply({ content: ":x: Cet item n'existe pas !", allowedMentions: { repliedUser: false } }); return }

                        const moneymore = new Discord.EmbedBuilder()
                            .setColor(data.color)
                            .setDescription(`:x: Vous n'avez pas assez de coins`)
                            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                        if (item.cost > bal) { return select.followUp({ embeds: [moneymore] }).catch(e => { }); }

                        let role = message.guild.roles.cache.get(item.id)
                        if (!role) {
                            delete difarr[item.id]
                            await data.guild.update({ cshop: shop }, { where: { guildId: message.guild.id } });
                            return message.channel.send(`:x: Je n'ai pas trouvé ce rôle: item supprimé du shop`);
                        }
                        if (message.member.roles.cache.has(role.id)) return message.channel.send(":x: Vous avez déjà ce rôle !")
                        await removeCoins(message.member.id, message.guild.id, item.cost, "coins");
                        message.member.roles.add(role.id).catch(e => { return message.channel.send(`:x: Je n'ai pas pu ajouter ce rôle !\nContactez un administrateur du serveur et vérifiez mes permissions !`) })
                        select.followUp(`Vous venez d'acheter un \`${item.name}\` pour \`${item.cost} coins\` et avez reçu le rôle **${role.name}** !`)
                        //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Vous avez acheté un \`${item.name}\` pour \`\`${item.cost} coins\`\``)
                        roww.components[0].setDisabled(false);
                    })
                    collector.on("end", async () => {
                        return messages.edit({ content: "Expiré !", components: [] }).catch(() => { })
                    })
                })
            } else return message.reply(`:x: Aucun item n'a été ajouté au shop du serveur !\nUtilisez la commande \`${data.prefix}items\` pour en ajouter !`)
        })
    }
};
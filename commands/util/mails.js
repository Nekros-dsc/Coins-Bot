const Discord = require("discord.js");
const { webhook, removeItems } = require("../../base/functions");
module.exports = {
    name: "mails",
    description: "Liste vos dernières transactions",
    aliases: ['mail', 'mylogs'],

    run: async (client, message, args) => {
        return message.reply(":warning: Système de mail en maintenance")
        const color = db.fetch(`${message.guild.id}_embedcolor_${message.author.id}`)
        let array = db.fetch(`${message.guild.id}_${message.author.id}_mail`)
        if (array && array.length > 20) {
            let adelete = array.length - 20
            let u = array.reverse()
            u = removeItems(array, parseInt(adelete))
            u = u.reverse()
            db.set(`${message.guild.id}_${message.author.id}_mail`, u)
            array = db.fetch(`${message.guild.id}_${message.author.id}_mail`)
        }
        let embeds = {};
        let page = 0;
        const size = 10;
        let memberarray = [];
        let member = []
        if (array && array.length > 0) {
            member = array.reverse().map(e => {
                return `${e}`
            })

            for (let i = 0; i < member.length; i += size) {
                const allMembers = member.slice(i, i + size);
                memberarray.push(allMembers);
            }
            memberarray.forEach((chunk, i) => embeds[i] = chunk);
        }
        const roww = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Supprimer ses mails')
                    .addOptions([{
                        label: 'Supprimer tous les mails',
                        description: 'Supprime tous les mails de votre boite mail',
                        value: 'clear'
                    }])
            )
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
        embed.setTitle(`📩 Voici votre boite mail (${member.length}${member.length > 19 ? " (max) " : ""})`)
        embed.setThumbnail("https://media.discordapp.net/attachments/1002173915549937715/1029091852734971944/unknown.png")
        embed.setColor(color)
        embed.setFooter({ text: `Epic'Mails | Page ${page + 1}/${memberarray.length}` })
        embed.setDescription(member.length > 0 ? embeds[0].join('\n') : "Vous n'avez pas de mails !");
        let components = []
        if (member.length > 0 && member.length <= 10) {

            components = [roww]
        } else if (member.length > 10) {
            components = [row, roww]
        }
        await message.reply({
            embeds: [embed],
            components: components
        }).then(messages => {

            const collector = messages.createMessageComponentCollector({
                componentType: Discord.ComponentTypeButton,
                time: 300000,
            })
            const collectorr = messages.createMessageComponentCollector({
                
                time: 300000
            })

            collectorr.on("collect", async (select) => {
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0]
                await select.deferUpdate()
                if (value == "clear") {
                    db.delete(`${message.guild.id}_${message.author.id}_mail`)
                    page = 0
                    embed.setDescription("Vous n'avez pas de mails !")
                    embed.setFooter({ text: `Epic'Mails | Page ${page + 1}/${memberarray.length}` })
                    messages.edit({
                        embeds: [embed],
                        components: []
                    }).catch(() => null)
                }
            })

            collector.on("collect", async (interaction) => {
                if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                await interaction.deferUpdate();

                if (interaction.customId === "left") {
                    if (page == parseInt(Object.keys(embeds).shift())) page = parseInt(Object.keys(embeds).pop())
                    else page--;
                    embed.setDescription(embeds[page].join('\n'))
                    embed.setFooter({ text: `Epic'Mails | Page ${page + 1}/${memberarray.length}` })

                    messages.edit({
                        embeds: [embed],
                        components: [row]
                    }).catch(() => null)
                }

                if (interaction.customId === "right") {
                    if (page == parseInt(Object.keys(embeds).pop())) page = parseInt(Object.keys(embeds).shift())
                    else page++;
                    embed.setDescription(embeds[page].join('\n'))
                    embed.setFooter({ text: `Epic'Mails | Page ${page + 1}/${memberarray.length}` })

                    messages.edit({
                        embeds: [embed],
                        components: [row]
                    }).catch(() => null)
                }
            });
            collector.on("end", async () => {
                return messages.edit({ content: "Expiré !", components: [] }).catch(() => { })
            })
        })
    }

};
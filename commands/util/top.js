const Discord = require('discord.js')
const LBtotal = require('../../base/functions/leaderboard/LBtotal')
const LBmain = require('../../base/functions/leaderboard/LBmain')
const LBbank = require('../../base/functions/leaderboard/LBbank')
const LBrep = require('../../base/functions/leaderboard/LBrep')
const LBvictoires = require('../../base/functions/leaderboard/LBvictoires')
const LBpalier = require('../../base/functions/leaderboard/LBpalier')
module.exports = {
    name: "top",
    description: "Affiche le leaderboard du serveur",
    aliases: ['lb', 'leaderboard'],

    run: async (client, message, args, data) => {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Faire une action')
                    .addOptions([
                        {
                            label: 'Top Total',
                            description: 'Affiche le leaderboard global du serveur (main + banque)',
                            value: 'total'
                        },
                        {
                            label: 'Top Poche',
                            description: 'Affiche le leaderboard des membres avec de l\'argent en main',
                            value: 'poche'
                        },
                        {
                            label: 'Top Banque',
                            description: 'Affiche le leaderboard des membres avec de l\'argent en banque',
                            value: 'bank'
                        },
                        {
                            label: 'Top Reputation',
                            description: 'Affiche le leaderboard des points de réputations des membres',
                            value: 'rep'
                        },
                        {
                            label: 'Top palier',
                            description: 'Affiche le leaderboard des paliers des membres',
                            value: 'lvl'
                        },
                        {
                            label: 'Top victoires',
                            description: 'Affiche le leaderboard desvictoires en duel',
                            value: 'monster'
                        },
                    ]),
            );
        await message.reply({
            content: '** **',
            allowedMentions: { repliedUser: false }
        }).then(async medit => {



            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Leaderboard total des coins sur ${message.guild.name}`, iconURL: "https://media.discordapp.net/attachments/1002173915549937714/1126429455066333184/1f911.png" })
                .setDescription(await LBtotal(message.guild.id, message.guild))
                .setColor(data.color)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

            medit.edit({ components: [row], embeds: [embed] })








            const collector = medit.createMessageComponentCollector({
                
                time: 60000
            })
            collector.on("collect", async (select) => { // tu prends celui que tu async
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                const value = select.values[0]
                await select.deferUpdate()
                if (select.isSelectMenu()) {
                    if (value == 'poche') {
                        await LB(message, medit, "coins")
                        select.followUp({ content: 'Voici le top des coins en main !', ephemeral: true })
                    } else if (value == 'total') {
                        await LB(message, medit, "total")
                    } else if (value == 'bank') {
                        await LB(message, medit, "bank")
                        select.followUp({ content: 'Voici le top des coins en banque !', ephemeral: true })
                    } else if (value == 'rep') {
                        await LB(message, medit, "rep")
                        select.followUp({ content: 'Voici le top des réputations !', ephemeral: true })
                    } else if (value == 'lvl') {
                        await LB(message, medit, "palier")
                        select.followUp({ content: 'Voici le top des paliers !', ephemeral: true })
                    } else if (value == 'monster') {
                        await LB(message, medit, "victoires")
                        select.followUp({ content: 'Voici le top des victoires !', ephemeral: true })
                    }
                }
            });




        })

        async function LB(message, medit, type) {
            let finalLb
            if (type == "coins") {
                finalLb = await LBmain(message.guild.id, message.guild)
            }
            if (type == "bank") {
                finalLb = await LBbank(message.guild.id, message.guild)
            }
            if (type == "rep") {
                finalLb = await LBrep(message.guild.id, message.guild)
            }
            if (type == "victoires") {
                finalLb = await LBvictoires(message.guild.id, message.guild)
            }
            if (type == "palier") {
                finalLb = await LBpalier(message.guild.id, message.guild)
            }
            if (type == "total") {
                finalLb = await LBtotal(message.guild.id, message.guild)
            }
            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Leaderboard des ${type} sur ${message.guild.name}`, iconURL: "https://media.discordapp.net/attachments/1002173915549937714/1114864514056327268/epiccoins.png" })
                .setDescription(finalLb || "Aucune donnée")
                .setColor(data.color)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) });

            return medit.edit({ content: "** **", embeds: [embed] })

        };

    }
}
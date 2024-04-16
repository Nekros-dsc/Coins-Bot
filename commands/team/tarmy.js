const Discord = require('discord.js');
const { msToTime } = require("../../base/functions");
var { army } = require("../../shop.json")
var rslow = require('../../roulette.js');
const userTeam = require('../../base/functions/teams/userTeam');
module.exports = {
    name: "tarmy",
    description: "Permets de gérer l'armée de la team",
    aliases: ['tarm'],

    run: async (client, message, args, data) => {

        let authorteam = await userTeam(message.member.id, message.guild.id)

        if (!authorteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
        if (!authorteam.rep || parseInt(authorteam.rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)
        message.reply("Chargement en cours...").then(msg => {
            update(msg)
            const collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.SelectMenu,
                time: 120000
            })

            collector.on("collect", async (select) => {
                if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                let value = select.values[0]
                authorteam = await userTeam(message.member.id, message.guild.id)
                let actual = authorteam.Upgrade || {}
                if (actual) {
                    if (actual.duration - (Date.now() - actual.date) > 0) {
                        let label = "L'amélioration"
                        if (actual.activity == "form") label = "L\'entrainement"
                        if (actual.activity == "heal") label = "La guérison"
                        return select.reply(`:x: ${label} est déjà en cours !`)
                    }
                }
                await select.deferUpdate().catch(e => { })
                value = value.split('-')
                let money = parseInt(authorteam.coins)
                if (value[0] == 'form') {
                    let price = value[1] * army.default.formation_cost
                    if (!money || money < price) { select.followUp({ content: `:x: Il vous manque \`${price - money} coins\` pour former des troupes !`, ephemeral: true }) } else {
                        authorteam.decrement('coins', { by: price });
                        authorteam.increment('army', { by: value[1] * army.default.formation });
                        await authorteam.update({ Upgrade: { date: Date.now(), duration: value[1] * army.default.duration, activity: "form" } }, { where: { primary: authorteam.primary }})
                        return update(msg)
                    }
                }
                if (value[0] == 'upgrade') {
                    let price = parseInt(value[1] - 1) * army.default.upgrade_cost
                    if (!money || money < price) { select.followUp({ content: `:x: Il vous manque \`${price - money} coins\` pour améliorer votre camp d'entrainement !`, ephemeral: true }) } else {
                        authorteam.decrement('coins', { by: price });
                        authorteam.increment('trainlevel', { by: 1 });
                        await authorteam.update({ Upgrade: { date: Date.now(), duration: value[1] * army.default.upgrade, activity: "upgrade" } }, { where: { primary: authorteam.primary }})
                        return update(msg)
                    }
                }
                if (value[0] == "heal") {
                    let dura = army.default.guerison_duration * value[1]
                    authorteam.increment('army', { by: value[1] });
                    await authorteam.update({ Upgrade: { date: Date.now(), duration: dura, activity: "heal" }, blesses: 0 }, { where: { primary: authorteam.primary }})
                    return update(msg)
                }
            })
        })

        async function update(msg) {
            authorteam = await userTeam(message.member.id, message.guild.id)

            let logprice = data.guild.Prices["logoprice"] || 10

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `📡 Armée de la team ${authorteam.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setDescription(`\`\`\`js\nTroupes: ${authorteam.army}\`\`\`\n\n`)
                .addFields([{ name: "🎖️ Niveau du camp d'entraînement:", value: `\`\`\`js\n${authorteam.trainlevel}\`\`\`` },
                { name: "🏥 Troupes blessées:", value: `\`\`\`js\n${authorteam.blesses}\`\`\`` }])
                .setColor(data.color)
            if (parseInt(authorteam.rep) >= parseInt(logprice) && authorteam.logo) embed.setThumbnail(authorteam.logo)
            if (rslow.allattacks[message.guild.id,"-",authorteam.teamid]) embed.setFooter({ text: "⚠️ En attaque" })
            let finallb = Object.entries(JSON.parse(authorteam.members))
            const memberData = finallb.find(([id]) => id === message.member.id);
            let compo = []
            if (memberData[1].rank <= 2) {
                let row2 = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Gérer l\'armée')
                            .addOptions([
                                {
                                    label: `Former des troupes`,
                                    description: `Lance la formation de ${army.default.formation * (authorteam.trainlevel)} troupes | Prix: ${authorteam.trainlevel * army.default.formation_cost}`,
                                    value: `form-${authorteam.trainlevel}`
                                },
                                {
                                    label: `Améliorer le camp`,
                                    description: `Améliore votre camp de formation au niveau ${1 + parseInt(authorteam.trainlevel)} | Prix: ${authorteam.trainlevel * army.default.upgrade_cost}`,
                                    value: `upgrade-${1 + parseInt(authorteam.trainlevel)}`
                                },
                                {
                                    label: `Soignez les troupes`,
                                    description: `Soigne ${authorteam.blesses} troupes | Durée: ${msToTime(army.default.guerison_duration * (parseInt(authorteam.blesses) || 0))}`,
                                    value: `heal-${authorteam.blesses}`
                                }
                            ])
                    )
                compo = [row2]
            }
            let actual = authorteam.Upgrade || {}

            if (actual) {
                if (actual.duration - (Date.now() - new Date(actual.date)) > 0) {
                    let label = "l'amélioration"
                    if (actual.activity == "form") label = "l\'entrainement"
                    if (actual.activity == "heal") label = "la guérison"
                    let button4 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('train').setLabel(`Fin de ${label} dans ${msToTime(actual.duration - (Date.now() - actual.date))}`).setDisabled(true)
                    row2 = new Discord.ActionRowBuilder().addComponents([button4])
                    compo = [row2]
                }
            }
            msg.edit({ content: " ", embeds: [embed], components: compo })
        }

    }
}


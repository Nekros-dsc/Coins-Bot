const Discord = require('discord.js');
var { army } = require("../../Utils/Functions/shop.json")
var rslow = require('../../Utils/Functions/roulette.js')

exports.help = {
  name: 'tarmy',
  aliases: ['tarm'],
  description: 'Permets de gérer l\'armée de la team',
  use: 'Pas d\'utilisation conseillée',
  category: 'Allances'
}
exports.run = async (bot, message, args, config, data) => {
    let authorteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)

    if (!authorteam) return message.channel.send(`:x: Vous n'avez pas de team !`)
    if (!JSON.parse(authorteam.coins).rep || parseInt(JSON.parse(authorteam.coins).rep) < 5) return message.channel.send(`:military_helmet: Vous devez avoir au moins 5 réputations de team pour débloquer l'armée !`)
    message.reply("Chargement en cours...").then(msg => {
        update(msg)
        const collector = msg.createMessageComponentCollector({
            componentType: Discord.ComponentType.SelectMenu,
            time: 120000
        })

        collector.on("collect", async (select) => {
            if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
            let value = select.values[0]
            authorteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)
            let actual = authorteam.upgrade || {}
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
            let money = parseInt(JSON.parse(authorteam.coins).coins)
            if (value[0] == 'form') {
                let price = value[1] * army.default.formation_cost
                if (!money || money < price) { select.followUp({ content: `:x: Il vous manque \`${price - money} coins\` pour former des troupes !`, ephemeral: true }) } else {
                    bot.functions.removeTeam(bot, message, args, team.id, price, "coins");
                    bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: value[1] * army.default.formation, id: authorteam.id});
                    bot.db.prepare(`UPDATE team SET upgrade = @coins WHERE id = @id`).run({ coins: JSON.stringify({ date: Date.now(), duration: value[1] * army.default.duration, activity: "form" }), id: authorteam.id});
                    return update(msg)
                }
            }
            if (value[0] == 'upgrade') {
                let price = parseInt(value[1] - 1) * army.default.upgrade_cost
                if (!money || money < price) { select.followUp({ content: `:x: Il vous manque \`${price - money} coins\` pour améliorer votre camp d'entrainement !`, ephemeral: true }) } else {
                    bot.functions.removeTeam(bot, message, args, team.id, price, "coins");
                    bot.db.prepare(`UPDATE team SET trainlevel = @coins WHERE id = @id`).run({ coins: authorteam.trainlevel + 1, id: authorteam.id});
                    bot.db.prepare(`UPDATE team SET upgrade = @coins WHERE id = @id`).run({ coins: JSON.stringify({ date: Date.now(), duration: value[1] * army.default.upgrade, activity: "upgrade" }), id: authorteam.id});
                    return update(msg)
                }
            }
            if (value[0] == "heal") {
                let dura = army.default.guerison_duration * value[1]
                bot.db.prepare(`UPDATE team SET army = @coins WHERE id = @id`).run({ coins: value[1], id: authorteam.id});
                bot.db.prepare(`UPDATE team SET upgrade = @coins, blesses = @blesse WHERE id = @id`).run({ coins: JSON.stringify({ date: Date.now(), duration: dura, activity: "heal" }), id: authorteam.id, blesse: 0});
                return update(msg)
            }
        })
    })

    async function update(msg) {
        authorteam = bot.functions.checkUserTeam(bot, message, args, message.author.id)

        let logprice = JSON.parse(data.gain).logo

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `📡 Armée de la team ${authorteam.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`\`\`\`js\nTroupes: ${authorteam.army}\`\`\`\n\n`)
            .addFields([{ name: "🎖️ Niveau du camp d'entraînement:", value: `\`\`\`js\n${authorteam.trainlevel}\`\`\`` },
            { name: "🏥 Troupes blessées:", value: `\`\`\`js\n${authorteam.blesses}\`\`\`` }])
            .setColor(data.color)
        if (parseInt(JSON.parse(authorteam.coins).rep) >= parseInt(logprice) && authorteam.logo) embed.setThumbnail(authorteam.logo)
        if (rslow.allattacks[message.guild.id,"-",authorteam.id]) embed.setFooter({ text: "⚠️ En attaque" })
        let finallb = JSON.parse(authorteam.members)
        const memberData = finallb.find(({ user }) => user === message.author.id);
        let compo = []
        if (memberData.rank <= "2") {
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
        let actual = authorteam.upgrade || {}

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

function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    let timeString = "";

    if (hours) {
        timeString += `${hours} heure${hours > 1 ? "s" : ""}, `;
    }
    if (minutes) {
        timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (seconds && !hours && !minutes) {
        timeString += `${seconds} seconde${seconds > 1 ? "s" : ""}`;
    }

    return timeString;
}
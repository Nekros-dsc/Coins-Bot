const { stripIndents } = require("common-tags");
const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: "help",
    description: "Affiche les commandes du bot",
    aliases: ["aide"],
    usage: "help [command]",
    run: async (client, message, args, data) => {

        if (!args[0]) {

            let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('next').setEmoji("▶️")
            let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('back').setEmoji("◀️")

            let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_next])
            const subFolders = fs.readdirSync('././commands')

            let gains = data.guild.Gains || {}
            let voicegain = gains.voicegain || 0
            let streamgain = gains.streamgain || 0
            let camgain = gains.camgain || 0

            let page0 = embed(':bust_in_silhouette: **• Serveur Informations**', `> :loud_sound: Vous gagnez \`${voicegain} coins\` toutes les 15 minutes lorsque vous êtes en vocal \n> :movie_camera: Vous gagnez \`${streamgain} coins\` lorsque vous êtes en stream \n> :video_camera: Et vous gagnez \`${camgain} coins\` lorsque vous activez votre caméra !\n\n[\`Support du bot\`](https://discord.gg/uhq)  |  [\`Lien pour m'ajouter\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) | [\`Vote pour CoinsBot\`](https://top.gg/bot/874400416731922432/vote)\n\n_Appuyez sur les flèches ci-dessous pour changer de page !_`, undefined)
            let page1 = embed(':moneybag:  **• Casino**', undefined, subFolders[3])
            let page2 = embed(':game_die: **• Jeux**', undefined, subFolders[5])
            let page3 = embed(':black_joker: **• Cartes**', undefined, subFolders[2])
            let page4 = embed(':shopping_bags: **• Achats**', undefined, subFolders[0])
            let page5 = embed(':key: **• Métiers**', undefined, subFolders[7])
            let page6 = embed(':crossed_swords: **• Alliances**', undefined, subFolders[8])
            let page7 = embed(':pill: **• Illégal**', undefined, subFolders[6])
            let page8 = embed('📃 **• Utilitaire**', undefined, subFolders[9])
            let page9 = embed(':crown: **• Administration**', undefined, subFolders[1])


            let page = [
                page0,
                page1,
                page2,
                page3,
                page4,
                page5,
                page6,
                page7,
                page8,
                page9
            ]


            let apage = 0
            page[apage].setFooter({ text: `©️ CoinsBot | By Ruwin & Karma & milleniumishere` })
            await message.reply({
                embeds: [page[apage]],
                components: [button_row],
                allowedMentions: { repliedUser: false }
            }).then(async msg => {
                const collector = msg.createMessageComponentCollector({
                    componentType: Discord.ComponentType.Button,
                    time: 150000
                })
                collector.on("collect", async (i) => {
                    if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
                    await i.deferUpdate()

                    if (i.customId === 'next') {
                        if (apage >= page.length - 1) { apage = 0 } else {
                            apage++
                        }
                        page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | By By Ruwin & Karma & milleniumishere`, iconURL: client.user.displayAvatarURL() })
                        msg.edit({ embeds: [page[apage]] })
                    }

                    if (i.customId === 'back') {
                        if (apage <= 0) { apage = page.length - 1 } else {
                            apage--
                        }
                        page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | By By Ruwin & Karma & milleniumishere`, iconURL: client.user.displayAvatarURL() })
                        msg.edit({ embeds: [page[apage]] })
                    }
                })

                collector.on("end", async () => {
                    button_row.components[0].setDisabled(true);
                    button_row.components[1].setDisabled(true);
                    return msg.edit({ embeds: [page[apage]], components: [button_row] }).catch(() => { })
                })
            })

            function embed(title, description, category, image) {
                let array = []
                if (category) {
                    const commandsFiles = fs.readdirSync(`././commands/${category}`).filter(file => file.endsWith('.js'))
                    for (const commandFile of commandsFiles) {
                        const command = require(`../../commands/${category}/${commandFile}`)
                        array.push(`\`${data.guild.Prefix}${command.usage ? command.usage : command.name}\`\n**${command.description}**`)
                    }
                }
                return new Discord.EmbedBuilder()
                    .setColor(data.color)
                    .setTitle(title ? title : "Aucun auteur pour l'embed !")
                    .setImage(image ? image : null)
                    .setDescription(description ? `Utilisez \`${data.guild.Prefix}help [commande]\` pour obtenir des informations sur une commande\n\n` + description : category && array.length > 0 ? `Utilisez \`${data.guild.Prefix}help [commande]\` pour obtenir des informations sur une commande\n\n` + array.map(e => e).join("\n\n") : "Pas de description précisée")
            }
        } else {
            const embed = new Discord.EmbedBuilder()
                .setColor(data.color)

                .setAuthor({ name: "Page d'aide de la commande " + args[0], iconURL: "https://cdn.discordapp.com/attachments/851876715835293736/852647593020620877/746614051601252373.png" })

            let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send(":x: Commande innexistante !")

            embed.setDescription(stripIndents`
          ** Commande -** [    \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`   ]\n
          ** Description -** [    \`${command.description || "Pas de description renseignée."}\`   ]\n
          ** Usage -** [   \`${command.usage ? `\`${command.usage}\`` : "Pas d'utilisation conseillée"}\`   ]\n
          ** Aliases -** [   \`${command.aliases ? command.aliases.join(" , ") : "Aucun"}\`   ]`)
            embed.setFooter({ text: `©️ E-Gestion | By By Ruwin & Karma & milleniumishere` })

            return message.channel.send({ embeds: [embed] })
        }
    }
}


const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const fs = require('fs')

exports.help = {
  name: 'help',
  aliases: ['aide'],
  description: 'Affiche les commandes du bot',
  use: 'help [command]',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    if (!args[0]) {

        let button_next = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('next').setEmoji("▶️")
        let button_back = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('back').setEmoji("◀️")

        let button_row = new Discord.ActionRowBuilder().addComponents([button_back, button_next])
        const subFolders = fs.readdirSync('./Commands')

        let gains = JSON.parse(data.gain)
        let voicegain = gains.voicegain
        let streamgain = gains.streamgain
        let camgain = gains.camgain

        let page0 = embed(':bust_in_silhouette: **• Serveur Informations**', `> :loud_sound: Vous gagnez \`${voicegain} coins\` toutes les 15 minutes lorsque vous êtes en vocal \n> :movie_camera: Vous gagnez \`${streamgain} coins\` lorsque vous êtes en stream \n> :video_camera: Et vous gagnez \`${camgain} coins\` lorsque vous activez votre caméra !\n\n[\`Support du bot\`](https://discord.gg/7hDfsSZeCK)  |  [\`Lien pour m'ajouter\`](https://discord.com/oauth2/authorize?bot_id=${bot.user.id}&scope=bot&permissions=8) | [\`Vote pour CoinsBot\`](https://discord.gg/7hDfsSZeCK)\n\n_Appuyez sur les flèches ci-dessous pour changer de page !_`, undefined, "https://media.discordapp.net/attachments/1249042420163674153/1250167077378195526/10056.gif?ex=6669f452&is=6668a2d2&hm=435b6f81e5461dc8259ed9a78e8e2245f07fdb48540ad861ab2ef705b8a15cf1&=&width=764&height=35")
        let page1 = embed(':moneybag:  **• Casino**', undefined, subFolders[4])
        let page2 = embed(':game_die: **• Jeux**', undefined, subFolders[7])
        let page3 = embed(':black_joker: **• Cartes**', undefined, subFolders[3])
        let page4 = embed(':shopping_bags: **• Achats**', undefined, subFolders[0])
        let page5 = embed(':key: **• Métiers**', undefined, subFolders[8])
        let page6 = embed(':crossed_swords: **• Alliances**', undefined, subFolders[2])
        let page7 = embed(':pill: **• Illégal**', undefined, subFolders[6])
        let page8 = embed('🧮 **• Entreprise**', undefined, subFolders[5])
        let page9 = embed('📃 **• Utilitaire**', undefined, subFolders[9])
        let page10 = embed(':crown: **• Administration**', undefined, subFolders[1])
        let page11 = embed(':new: **• API**', `**Connectez votre bot à notre API** afin de personnaliser votre expérience avec CoinsBot !\n\nL'API CoinsBot offre une multitude de fonctionnalités que vous pouvez explorer et expérimenter. Découvrez des façons innovantes d'engager votre communauté et de rendre votre bot encore plus amusant et interactif.\n\nN'oubliez pas de consulter notre [documentation](https://discord.gg/7hDfsSZeCK) pour en savoir plus sur les endpoints et les fonctionnalités disponibles sur notre API.\n\nAvec l'API CoinsBot, les possibilités sont infinies ! Profitez de cette opportunité pour créer une expérience inoubliable pour vos utilisateurs et les emmener dans une aventure passionnante avec CoinsBot ! Si vous avez besoin d'aide, notre équipe de support est là pour vous guider à chaque étape du processus.\n\nAlors, qu'attendez-vous ? **Connectez votre bot à CoinsBot API dès maintenant** et plongez dans une expérience personnalisée et palpitante pour vos utilisateurs !`, undefined)


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
            page9, 
            page10,
            page11
        ]


        let apage = 0
        page[apage].setFooter({ text: config.footerText })
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
                    page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | ${config.footerText}`, iconURL: bot.user.displayAvatarURL() })
                    msg.edit({ embeds: [page[apage]] })
                }

                if (i.customId === 'back') {
                    if (apage <= 0) { apage = page.length - 1 } else {
                        apage--
                    }
                    page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | ${config.footerText}`, iconURL: bot.user.displayAvatarURL() })
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
                    array.push(`\`${data.prefix}${command.help.use !== 'Pas d\'utilisation conseillée' ? command.help.use : command.help.name}\`\n┖ ${command.help.description}`)
                }
            }
            return new Discord.EmbedBuilder()
                .setColor(data.color)
                .setTitle(title ? title : "Aucun auteur pour l'embed !")
                .setImage(image ? image : null)
                .setDescription(description ? `Utilisez \`${data.prefix}help [commande]\` pour obtenir des informations sur une commande\n\n` + description : category && array.length > 0 ? `Utilisez \`${data.prefix}help [commande]\` pour obtenir des informations sur une commande\n\n` + array.map(e => e).join("\n\n") : "Pas de description précisée")
        }
    } else {
        const embed = new Discord.EmbedBuilder()
            .setColor(data.color)

            .setAuthor({ name: "Page d'aide de la commande " + args[0], iconURL: "https://media.discordapp.net/attachments/1249042420163674153/1250181494903931001/746614051601252373.png?ex=666a01bf&is=6668b03f&hm=497032e9d771eae49b587f1cd22d3f0f3daceb50b8c87341315005564a8f3f2b&=&format=webp&quality=lossless&width=230&height=230" })

        let command = bot.commands.get(args[0].toLowerCase())
        if (!command) return message.channel.send(":x: Commande innexistante !")

        embed.setDescription(stripIndents`
      ** Commande -** [    \`${command.help.name.slice(0, 1).toUpperCase() + command.help.name.slice(1)}\`   ]\n
      ** Description -** [    \`${command.help.description || "Pas de description renseignée."}\`   ]\n
      ** Usage -** [   \`${command.help.use ? `\`${command.help.use}\`` : "Pas d'utilisation conseillée"}\`   ]\n
      ** Aliases -** [   \`${command.help.aliases ? command.help.aliases.join(" , ") : "Aucun"}\`   ]`)
        embed.setFooter({ text: `${config.footerText}` })

        return message.channel.send({ embeds: [embed] })
    }
}
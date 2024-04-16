const Discord = require("discord.js");
const { webhook, wlog, msToTime, between } = require("../../base/functions");
const addCoins = require("../../base/functions/addCoins");
const setCooldown = require("../../base/functions/setCooldown");
const removeCoins = require("../../base/functions/removeCoins");
module.exports = {
    name: "gift",
    description: "Génère trois cartes, choisissez la bonne !",
    aliases: ['gft'],

    run: async (client, message, args, data) => {
        let timeout = 3600000
        if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "gift", timeout, true))) return

        let gains = data.guild.Gains
        let minimum = gains.gfmin || -400
        let maximum = gains.gfmax || 500

        let button1 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('1').setEmoji("1️⃣")
        let button2 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('2').setEmoji("2️⃣")
        let button3 = new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Primary).setCustomId('3').setEmoji("3️⃣")


        let button_row = new Discord.ActionRowBuilder().addComponents([button1, button2, button3])
        let embed5 = new Discord.EmbedBuilder()
            .setTitle(`Trois cartes sont à votre disposition...`)
            .setColor(data.color)
            .setDescription(`Choisissez une des cartes ci-dessous !\nEt tentez de gagner entre \`${minimum} coins\` et \`${maximum} coins\` !\n:warning: Elles expirent dans <t:${Date.parse(new Date(Date.now() + 60000)) / 1000}:R> !`)
            .setImage("https://media.discordapp.net/attachments/857612230748930078/1014239087638618173/coinsbot_gift.png")
            .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
        message.reply({ embeds: [embed5], components: [button_row], allowedMentions: { repliedUser: false } }).then(async msg => {
            const collector = msg.createMessageComponentCollector({
                componentType: Discord.ComponentType.Button,
                time: 60000
            })

            collector.on("collect", async (i) => {
                collector.stop()
                if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
                await i.deferUpdate()
                if (!(await setCooldown(message, data.color, message.author.id, message.guild.id, "gift", timeout, false))) return
                let gain = between(minimum, maximum)
                let btn1 = between(minimum, maximum)
                let btn2 = between(minimum, maximum)
                let btn3 = between(minimum, maximum)
                if (gain > 0) {
                    await addCoins(message.member.id, message.guild.id, gain, "coins")
                    let embed = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`:gift: **Vous venez de gagner \`${gain} coins\` !**`)
                        .addFields(
                            { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                            { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                            { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                        )
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    msg.edit({ embeds: [embed], components: [] }).catch()
                    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :green_circle: Votre \`gift\` vous a rapporté \`\`${gain} coins\`\``)
                    return wlog(message.author, "Green", message.guild, `${message.author.tag} vient de gagner \`\`${gain} coins\`\``, "Gift")
                } else if (gain < 0) {
                    await removeCoins(message.member.id, message.guild.id, -gain, "coins")
                    let embed = new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`:gift: **Vous venez de perdre \`${gain} coins\` !**`)
                        .addFields(
                            { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                            { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                            { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                        )
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    msg.edit({ embeds: [embed], components: [] }).catch()
                    //db.push(`${message.guild.id}_${message.author.id}_mail`, `<t:${Date.parse(new Date(Date.now())) / 1000}:d>) :red_circle: Votre \`gift\` vous a fait perdre \`\`${gain} coins\`\``)
                    wlog(message.author, "Red", message.guild, `${message.author.tag} vient de perdre \`\`${gain} coins\`\``, "Gift")
                } else {
                    let embed = new Discord.EmbedBuilder()
                        .setColor("Black")
                        .setDescription(`:gift: **Vous venez de tomber sur 0 (cheh) !**`)
                        .addFields(
                            { name: 'Carte 1', value: parseInt(i.customId) === 1 ? `\`${gain} coins\`` : `\`${btn1} coins\`` },
                            { name: 'Carte 2', value: parseInt(i.customId) === 2 ? `\`${gain} coins\`` : `\`${btn2} coins\`` },
                            { name: 'Carte 3', value: parseInt(i.customId) === 3 ? `\`${gain} coins\`` : `\`${btn3} coins\`` },
                        )
                        .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
                    msg.edit({ embeds: [embed], components: [] }).catch()
                    wlog(message.author, "Black", message.guild, `${message.author.tag} vient de faire 0 (cheh)`, "Gift")
                }

            })
        })


    }
}
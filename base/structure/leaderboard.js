const Discord = require('discord.js')
module.exports = {
    name: 'ready',

    run: async (client) => {
        try {
            return
            const inter = setInterval(async () => {

                client.guilds.cache.forEach(async (guild) => {
                    const idsize = guild.id.length
                    let channel = await guild.channels.cache.get(db.get(`leaderboard_${guild.id}`))
                    if (!channel) return;
                    if (channel) {
                        const message = await client.channels.cache.get(db.get(`leaderboard_${guild.id}`)).messages.fetch(db.get(`msgleaderboard_${guild.id}`)).catch(e => { console.log(e) })
                        if (message) {
                            let main = new Discord.ButtonBuilder().setLabel('Top Main').setStyle(Discord.ButtonStyle.Success).setCustomId('main')
                            let bank = new Discord.ButtonBuilder().setLabel('Top Banque').setStyle('DANGER').setCustomId('banque')
                            let rep = new Discord.ButtonBuilder().setLabel('Top Rep').setStyle(Discord.ButtonStyle.Secondary).setCustomId('rep')


                            const row = new Discord.ActionRowBuilder().addComponents([main, bank, rep])

                            const embed = new Discord.EmbedBuilder()
                                .setColor('2F3136')
                                .setDescription('Cliques sur le boutton correspondant au leaderboard que tu souhaites consulter ci-dessous !')
                            await message.edit({ embeds: [embed], content: `Last update <t:${Date.parse(new Date) / 1000}> (<t:${Date.parse(new Date) / 1000}>)`, components: [row] })


                            const collector = message.createMessageComponentCollector({
                                componentType: Discord.ComponentTypeButton,
                                time: 70001
                            })
                            collector.on('collect', async (button) => {
                                await button.deferUpdate();
                                if (button.isButton()) {
                                    if (button.customId === "main") {

                                        let money = db.all().filter(data => data.ID.startsWith(`${message.guild.id}_balance_`)).sort((a, b) => b.data - a.data)
                                        let finalLb = "";
                                        let m = 10
                                        if (money.length < 10) m = money.length
                                        let k = 0
                                        for (var i in money) {
                                            let user = money[i].ID.slice(idsize + 9)
                                            let member = message.guild.members.cache.get(user)
                                            if (!member) { money.length = money.length + 1; continue; }
                                            if (member) {
                                                if (money[i].data === 0) break;
                                                k++
                                                if (user === message.author.id) { finalLb += `${k}) **${member.user.username}** \n \`${money[i].data} coins\` :coin:\n`; } else {
                                                    finalLb += `${k}) ${member.user.username} \n \`${money[i].data} coins\` :coin:\n`;
                                                } if (k >= m) break;
                                            }
                                        }


                                        const embed = new Discord.EmbedBuilder()
                                            .setAuthor({ name: `Leaderboard des coins en main sur ${guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                                            .setDescription(finalLb ? finalLb : "Aucune donnée")
                                            .setColor('2F3136')
                                        return button.followUp({ embeds: [embed], ephemeral: true })
                                    }
                                }

                                if (button.customId === "banque") {

                                    let money = db.all().filter(data => data.ID.startsWith(`${message.guild.id}_bank_`)).sort((a, b) => b.data - a.data)
                                    let finalLb = "";
                                    let m = 10
                                    if (money.length < 10) m = money.length
                                    let k = 0
                                    for (var i in money) {
                                        let user = money[i].ID.slice(idsize + 6)
                                        let member = message.guild.members.cache.get(user)
                                        if (!member) { money.length = money.length + 1; continue; }
                                        if (member) {
                                            if (money[i].data === 0) break;
                                            k++

                                            if (user === message.author.id) { finalLb += `${k}) **${member.user.username}** \n \`${money[i].data} coins\` :bank:\n`; } else {
                                                finalLb += `${k}) ${member.user.username} \n \`${money[i].data} coins\` :bank:\n`;
                                            } if (k >= m) break;
                                        }
                                    }

                                    const embed = new Discord.EmbedBuilder()
                                        .setAuthor({ name: `Leaderboard des coins en banque sur ${guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                                        .setDescription(finalLb ? finalLb : "Aucune donnée")
                                        .setColor('2F3136')
                                    button.followUp({ embeds: [embed], ephemeral: true })
                                }

                                if (button.customId === "rep") {

                                    let money = db.all().filter(data => data.ID.startsWith(`${message.guild.id}_reputation_`)).sort((a, b) => b.data - a.data)
                                    let finalLb = "";
                                    let m = 10
                                    if (money.length < 10) m = money.length
                                    let k = 0
                                    for (var i in money) {
                                        let user = money[i].ID.slice(idsize + 12)
                                        let member = message.guild.members.cache.get(user)
                                        if (!member) { money.length = money.length + 1; continue; }
                                        if (member) {
                                            if (money[i].data === 0) break;
                                            k++
                                            if (user === message.author.id) { finalLb += `${k}) **${member.user.username}** \n \`${money[i].data} rep\` :small_red_triangle:\n`; } else {
                                                finalLb += `${k}) ${member.user.username} \n \`${money[i].data} rep\` :small_red_triangle:\n`;
                                            } if (k >= m) break;
                                        }
                                    }

                                    const embed = new Discord.EmbedBuilder()
                                        .setAuthor({ name: `Leaderboard des rep sur ${guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                                        .setDescription(finalLb ? finalLb : "Aucune donnée")
                                        .setColor('2F3136')
                                    button.followUp({ embeds: [embed], ephemeral: true })
                                }
                            })
                        }
                    }
                })

            }, 70000)
        }
        catch (e) {
            console.log(e)
        }
    }
}

